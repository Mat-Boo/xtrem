<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Class\Mail;
use App\Entity\Club;
use App\Entity\ClubPermission;
use App\Entity\Partner;
use App\Entity\PartnerPermission;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Session\Session;

class ClubController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/club/{id}', name: 'club', methods: ['GET'])]
    public function getClub(SerializerInterface $serializer, $id, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Recherche d'un partenaire en fonction de l'id
            $club = $this->entityManager->getRepository(Club::class)->findOneById($id);
    
            //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
            $json = $serializer->serialize($club, 'json', ['groups' => 'club:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
            return $response;
        }
    }

    #[Route('/api/partner/{id}/club/create', name: 'partner_club_create', methods: ['POST'])]
    public function createClub(Request $request, SerializerInterface $serializer, SluggerInterface $slugger, $id, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de création d'un club
            $content = [];
            $content['name'] = $request->get('name');
            $content['logoFile'] = $request->files->get('logoFile');
            $content['logoFileName'] = $request->get('logoFileName');
            $content['address'] = $request->get('address');
            $content['zipcode'] = $request->get('zipcode');
            $content['city'] = $request->get('city');
            $content['firstname'] = $request->get('firstname');
            $content['lastname'] = $request->get('lastname');
            $content['phone'] = $request->get('phone');
            $content['email'] = $request->get('email');
            $content['permissions'] = $request->get('permissions');
    
            //Application de la fonction de contrôle des champs renseignés dans le formulaire de création d'un club
            $errorsValidation  = new ErrorsValidation($content);
            $errors = $errorsValidation->formItemControl();
            
            //Vérification de l'email pour voir si il n'existe pas en base de donnée
            $search_email = $this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
            if ($search_email) {
                $errors['email'] = 'L\'email renseigné est déjà présent en base de données';
            } 
            if (empty($errors)) {
                //Création de la nouvelle instance User
                $user = new User;
                $user->setFirstname(ucwords(strtolower($content['firstname'])));
                $user->setLastname(ucwords(strtolower($content['lastname'])));
                $user->setPhone($content['phone']);
                $user->setEmail($content['email']);
                $user->setIsActive(1);
                $user->setRoles(['ROLE_CLUB']);
                $user->setHasCreatedPwd(0);
                $uuid = Uuid::uuid4();
                $user->setUuid($uuid->toString());
        
                //Copie du logo du club dans le dossier uploads (avec renommage du fichier avec le nom du club sluggé)
                $logo = $content['logoFile'];
                $slugLogoName = $slugger->slug($content['name']);
                $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
                $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
        
                //Création de la nouvelle instance Club
                $club = new Club;
                $club->setName(ucwords(strtolower($content['name'])));
                $club->setPicture($newLogoName);
                $club->setAddress(ucfirst(strtolower($content['address'])));
                $club->setZipcode($content['zipcode']);
                $club->setCity(ucwords(strtolower($content['city'])));
                $club->setIsActive(true);
                $club->setManager($user);
                
                //Mise à jour de l'utilisateur nouvellement créé en lui rattachant le nouveau club créé
                $user->setClub($club);
                $this->entityManager->persist($user);
    
                //Recherche du partenaire dont dépend le club
                $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);
                //Mise à jour du partenaire dont dépend le club en lui rattachant le nouveau club créé
                $partner->addClub($club);
                $this->entityManager->persist($partner);            
    
                //Récupération de toutes les permissions du partenaire dont dépend le club
                $partnerPermissions = $this->entityManager->getRepository(PartnerPermission::class)->findByPartner($id);
                
                //Création des nouvelles instances ClubPermission
                foreach($content['permissions'] as $idPermission => $statePermission) {
                    $clubPermission = new ClubPermission;
                    $clubPermission->setClub($club);
                    foreach($partnerPermissions as $partnerPermission) {
                        if ($idPermission === $partnerPermission->getPermission()->getId()) {
                            $clubPermission->setPartnerPermissions($partnerPermission);
                        }
                    }
                    $clubPermission->setIsActive($statePermission);
    
                    //Ajout des permissions associées au club
                    $club->addClubPermission($clubPermission);
                    $this->entityManager->persist($club);
                    $this->entityManager->persist($clubPermission);
                    
                }
                //Mise à jour de la base de donnée avec le nouvel utilisateur, le nouveau club et les permissions associées au nouveau club
                $this->entityManager->flush();
        
                //Création de la réponse pour renvoyer le json contenant les infos du nouveau club
                $json = $serializer->serialize($club, 'json', ['groups' => 'club:edit']);
                $response = new Response($json, 200, [
                    'Content-Type' => 'application/json'
                ]);
                
                ////Envoie d'un mail au manager du club pour lui transmettre le lien de création de mot de passe
                //Et envoie d'un mail aussi au contact de son partenaire pour le prévenir de cette nouvelle création
                (new Mail())->createClub(
                    $user->getFirstname(), 
                    $user->getLastname(), 
                    $user->getEmail(), 
                    $user->getUuid(),
                    $club->getName(),
                    $partner->getcontact()->getFirstname(),
                    $partner->getcontact()->getEmail());
            } else {
                //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de création d'un club
                $errorsJson = $serializer->serialize($errors, 'json');
                $response = new Response($errorsJson, 500, [
                    'Content-Type' => 'application/json'
                ]);
            }
            return $response;
        }
    }

    #[Route('/api/club/{idClub}/edit', name: 'partner_club_edit', methods: ['POST'])]
    public function editClub(Request $request, SerializerInterface $serializer, SluggerInterface $slugger, $idClub, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de modification d'un club
            $content = [];
            $content['name'] = $request->get('name');
            if (!$request->get('displayedLogo')) {
                if ($request->files->get('logoFile') !== null) {
                    $content['logoFile'] = $request->files->get('logoFile');
                    $content['logoFileName'] = $request->get('logoFileName');
                } else if ($request->files->get('logo') === null) {
                    $content['logoFile'] = null;
                }
            }
            $content['address'] = $request->get('address');
            $content['zipcode'] = $request->get('zipcode');
            $content['city'] = $request->get('city');
            $content['firstname'] = $request->get('firstname');
            $content['lastname'] = $request->get('lastname');
            $content['phone'] = $request->get('phone');
            $content['email'] = $request->get('email');
            $content['isActive'] = $request->get('isActive');
    
            //Recherche du club concerné par la modification en fonction de l'id
            $club = $this->entityManager->getRepository(Club::class)->findOneById($idClub);
            
            if ($content['isActive'] !== null) {          
                //Mise à jour du statut du club
                $club->setIsActive($content['isActive']);
                //Mise à jour du statut du manager du club pour l'autoriser ou l'empêcher de se connecter
                $club->getManager()->setIsActive($content['isActive']);
    
                //Envoie d'un mail au manager du club pour l'informer de l'activation ou désactivation du club
                //Et envoie d'un mail aussi au contact de son partenaire pour le prévenir de cette activation ou désactivation
                (new Mail())->toggleClub(
                    $content['isActive'],
                    $club->getName(),
                    $club->getManager()->getFirstname(), 
                    $club->getManager()->getLastname(),
                    $club->getManager()->getEmail(), 
                    $club->getPartner()->getcontact()->getFirstname(),
                    $club->getPartner()->getcontact()->getEmail());
            } else {
                //Application de la fonction de contrôle des champs renseignés dans le formulaire de création d'un club
                $errorsValidation  = new ErrorsValidation($content);
                $errors = $errorsValidation->formItemControl();
    
                //Recherche de l'utilisateur lié au club
                $user = $this->entityManager->getRepository(User::class)->findOneById($club->getManager()->getId());
                
                //Recherche de l'utilisateur par l'email renseigné dans le formulaire pour vérifier si il n'existe pas en base de donnée
                $search_email = $this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
                if ($search_email && $search_email->getEmail() !== $user->getEmail()) {
                    $errors['email'] = 'L\'email renseigné est déjà présent en base de données';
                }
                if (empty($errors)) {
                    //Modification du manager du club en vérifiant si le champs concerné a été modifié
                    $content['firstname'] !== $user->getFirstname() ? $user->setFirstname(ucwords(strtolower($content['firstname']))) : null;
                    $content['lastname'] !== $user->getLastname() ? $user->setLastname(ucwords(strtolower($content['lastname']))) : null;
                    $content['phone'] !== $user->getPhone() ? $user->setPhone($content['phone']) : null;
                    $content['email'] !== $user->getEmail() ? $user->setEmail($content['email']) : null;
                    //Mise à jour de l'utilisateur modifié
                    $this->entityManager->persist($user);
    
                    //Modification du club en vérifiant si le champs concerné a été modifié
                    $content['name'] !== $club->getName() ? $club->setName(ucwords(strtolower($content['name']))) : null;
                    $content['address'] !== $club->getAddress() ? $club->setAddress(ucfirst(strtolower($content['address']))) : null;
                    $content['zipcode'] !== $club->getZipcode() ? $club->setZipcode(ucfirst(strtolower($content['zipcode']))) : null;
                    $content['city'] !== $club->getCity() ? $club->setCity(ucwords(strtolower($content['city']))) : null;
                    //Copie de la photo du club dans le dossier uploads (Avec renommage du nouveau fichier avec le nom du club sluggé) si modifié
                    if (isset($content['logoFile'])) {
                        //Ajout de la nouvelle photo
                        $logo = $content['logoFile'];
                        $slugLogoName = $slugger->slug($content['name']);
                        $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
                        $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
                        $club->setPicture($newLogoName);
                    }                
                    //Envoie d'un mail au manager du club pour l'informer des modifications effectuées
                    //Et envoie d'un mail aussi au contact de son partenaire pour le prévenir de cette modification
                    (new Mail())->editClub(
                        $club->getManager()->getFirstname(), 
                        $club->getManager()->getLastname(),
                        $club->getManager()->getPhone(),
                        $club->getManager()->getEmail(), 
                        $club->getName(),
                        $club->getAddress(),
                        $club->getZipcode(),
                        $club->getCity(),
                        $club->getPartner()->getcontact()->getFirstname(),
                        $club->getPartner()->getcontact()->getEmail());
                } else {
                    //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification du club
                    $errorsJson = $serializer->serialize($errors, 'json');
                    $response = new Response($errorsJson, 500, [
                        'Content-Type' => 'application/json'
                    ]);
    
                    return $response;
                }
            }
            //Mise à jour du club modifié
            $this->entityManager->persist($club);
            //Mise à jour de la base de donnée avec les modification du club et/ou de l'utilisateur
            $this->entityManager->flush();
    
            //Création de la réponse pour renvoyer le json contenant les infos du club modifié
            $json = $serializer->serialize($club, 'json', ['groups' => 'club:edit']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
    
    
            return $response;
        }
    }

    #[Route('/api/club/{idClub}/delete', name: 'partner_club_delete', methods: ['DELETE'])]
    public function deleteClub(SerializerInterface $serializer, $idClub, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Recherche du club concerné par la suppression en fonction de l'id
            $club = $this->entityManager->getRepository(Club::class)->findOneById($idClub);
    
            //Suppression des relations Club et Permission
            foreach($club->getClubPermissions() as $clubPermission) {
                $this->entityManager->remove($clubPermission);
            }
            
            //Suppression de la photo du club
            $picture = $club->getPicture();
            $picturePath = '../public/uploads/' . $picture;
            if (file_exists($picturePath)) {
                unlink($picturePath);
            }
    
            //Suppression du lmanager du club
            $this->entityManager->remove($club->getManager());
    
            //Suppression du club
            $this->entityManager->remove($club);
    
            //Mise à jour de la base de donnée
            $this->entityManager->flush();
    
            //Création de la réponse pour renvoyer le json contenant les infos du club supprimé
            $json = $serializer->serialize($club, 'json', ['groups' => 'club:edit']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
    
            //Envoie d'un mail au manager du club pour l'informer de la suppression
            //Et envoie d'un mail aussi au contact de son partenaire pour le prévenir de cette suppression
            (new Mail())->deleteClub(
                $club->getManager()->getFirstname(), 
                $club->getManager()->getLastname(),
                $club->getManager()->getEmail(), 
                $club->getName(),
                $club->getPartner()->getcontact()->getFirstname(),
                $club->getPartner()->getcontact()->getEmail());
            
            return $response;
        }
    }
}
