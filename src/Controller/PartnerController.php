<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Class\Mail;
use App\Entity\Partner;
use App\Entity\PartnerPermission;
use App\Entity\Permission;
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

class PartnerController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/partners', name: 'partners', methods: ['GET'])]
    public function getPartners(SerializerInterface $serializer, Request $request, Session $session): Response
    {           
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {

            //Récupération de tous les partenaires en base de données
            $partners = $this->entityManager->getRepository(Partner::class)->findAll();
            
            //Création de la réponse pour renvoyer le json contenant tous les partenaires
            $json = $serializer->serialize($partners, 'json', ['groups' => 'partners:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            return $response;
        }
        
    }

    #[Route('/api/partner/{id}', name: 'partner', methods: ['GET'])]
    public function getPartner(SerializerInterface $serializer, $id, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Recherche d'un partenaire en fonction de l'id
            $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);
    
            //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
            $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
            return $response;
        }
    }

    #[Route('/api/partner/create', name: 'partner_create', methods: ['POST'])]
    public function createPartner(Request $request, SerializerInterface $serializer, SluggerInterface $slugger, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de création d'un partenaire
            $content = [];
            $content['name'] = $request->get('name');
            $content['logoFile'] = $request->files->get('logoFile');
            $content['logoFileName'] = $request->get('logoFileName');
            $content['description'] = $request->get('description');
            $content['firstname'] = $request->get('firstname');
            $content['lastname'] = $request->get('lastname');
            $content['phone'] = $request->get('phone');
            $content['email'] = $request->get('email');
            $content['permissions'] = $request->get('permissions');
    
            //Application de la fonction de contrôle des champs renseignés dans le formulaire de création d'un partenaire
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
                $user->setRoles(['ROLE_PARTNER']);
                $user->setHasCreatedPwd(0);
                $uuid = Uuid::uuid4();
                $user->setUuid($uuid->toString());
        
                //Copie du logo du partenaire dans le dossier uploads (avec renommage du fichier avec le nom du partenaire sluggé)
                $logo = $content['logoFile'];
                $slugLogoName = $slugger->slug($content['name']);
                $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
                $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
        
                //Création de la nouvelle instance Partner
                $partner = new Partner;
                $partner->setName(ucwords(strtolower($content['name'])));
                $partner->setLogo($newLogoName);
                $partner->setDescription(ucfirst(strtolower($content['description'])));
                $partner->setIsActive(true);
                $partner->setContact($user);
                
                //Mise à jour de l'utilisateur nouvellement créé en lui rattachant le nouveau partenaire créé
                $user->setPartner($partner);
                $this->entityManager->persist($user);
    
                //Récupération de toutes les permissions en base de données
                $permissions = $this->entityManager->getRepository(Permission::class)->findAll();
    
                //Création des nouvelles instances PartnerPermission
                foreach($content['permissions'] as $idPermission => $statePermission) {
                    $partnerPermission = new PartnerPermission;
                    $partnerPermission->setPartner($partner);
                    foreach($permissions as $permission) {
                        if ($idPermission === $permission->getId()) {
                            $partnerPermission->setPermission($permission);
                        }
                    }
                    $partnerPermission->setIsActive($statePermission);
    
                    //Ajout des permissions associées au partenaire
                    $partner->addPartnerPermission($partnerPermission);
    
                    $this->entityManager->persist($partnerPermission);
                    $this->entityManager->persist($partner);
                }
                //Mise à jour de la base de donnée avec le nouvel utilisateur, le nouveau partenaire et les permissions associées au nouveau partenaire
                $this->entityManager->flush();
        
                //Création de la réponse pour renvoyer le json contenant les infos du nouveau partenaire
                $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:edit']);
                $response = new Response($json, 200, [
                    'Content-Type' => 'application/json'
                ]);
    
                //Envoie d'un mail au contact du partenaire pour lui transmettre le lien de création de mot de passe
                (new Mail())->createPartner($user->getFirstname(), $user->getEmail(), $user->getUuid());
                
            } else {
                //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de création d'un partenaire
                $errorsJson = $serializer->serialize($errors, 'json');
                $response = new Response($errorsJson, 500, [
                    'Content-Type' => 'application/json'
                ]);
            }
            return $response;
        }
    }

    #[Route('/api/partner/{id}/edit', name: 'partner_edit', methods: ['POST'])]
    public function editPartner(Request $request, $id, SerializerInterface $serializer, SluggerInterface $slugger, Session $session)
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de modification d'un partenaire
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
            $content['description'] = $request->get('description');
            $content['firstname'] = $request->get('firstname');
            $content['lastname'] = $request->get('lastname');
            $content['phone'] = $request->get('phone');
            $content['email'] = $request->get('email');
            $content['isActive'] = $request->get('isActive');

            
            
            //Recherche du partenaire concerné par la modification en fonction de l'id
            $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);
            
            if ($content['isActive'] !== null) {          
                //Mise à jour du statut du partenaire
                $partner->setIsActive($content['isActive']);
                //Mise à jour du statut du contact du partenaire pour l'autoriser ou l'empêcher de se connecter
                $partner->getContact()->setIsActive($content['isActive']);
                //Envoie d'un mail au contact du partenaire pour lui indiquer que son compte est activé ou désactivé
                (new Mail())->togglePartner($content['isActive'], $partner->getName(), $partner->getContact()->getFirstname(), $partner->getContact()->getEmail());
                //Mise à jour du statut des clubs si désactivation du partenaire et envoi de mail
                if ($content['isActive'] === "0") {
                    //Envoie d'un mail au manager des clubs pour l'informer de la désactivation des club
                    //Et envoie d'un mail aussi au contact de leur partenaire pour le prévenir de ces désactivation
                    (new Mail())->toggleClubs(
                        $partner->getClubs(), 
                        $partner->getName(),
                        $partner->getcontact()->getFirstname(),
                        $partner->getcontact()->getEmail());
    
                    forEach($partner->getClubs() as $club) {
                        $club->setIsActive(0);
                        $club->getManager()->setIsActive(0);
                    }
                }
    
            } else {
                //Application de la fonction de contrôle des champs renseignés dans le formulaire de création d'un partenaire
                $errorsValidation  = new ErrorsValidation($content);
                $errors = $errorsValidation->formItemControl();
                
                //Recherche de l'utilisateur lié au partenaire
                $user = $this->entityManager->getRepository(User::class)->findOneById($partner->getContact()->getId());
                
                //Recherche de l'utilisateur par l'email renseigné dans le formulaire pour vérifier si il n'existe pas en base de donnée
                $search_email = $this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
                if ($search_email && $search_email->getEmail() !== $user->getEmail()) {
                    $errors['email'] = 'L\'email renseigné est déjà présent en base de données';
                }
                if (empty($errors)) {
                    //Modification du contact du partenaire en vérifiant si le champs concerné a été modifié
                    $content['firstname'] !== $user->getFirstname() ? $user->setFirstname(ucwords(strtolower($content['firstname']))) : null;
                    $content['lastname'] !== $user->getLastname() ? $user->setLastname(ucwords(strtolower($content['lastname']))) : null;
                    $content['phone'] !== $user->getPhone() ? $user->setPhone($content['phone']) : null;
                    $content['email'] !== $user->getEmail() ? $user->setEmail($content['email']) : null;
                    //Mise à jour de l'utilisateur modifié
                    $this->entityManager->persist($user);
                    
                    //Modification du partenaire en vérifiant si le champs concerné a été modifié
                    $content['name'] !== $partner->getName() ? $partner->setName(ucwords(strtolower($content['name']))) : null;
                    $content['description'] !== $partner->getDescription() ? $partner->setDescription(ucfirst(strtolower($content['description']))) : null;
                    //Copie du logo du partenaire dans le dossier uploads (avec renommage du fichier avec le nom du partenaire sluggé) si modifié
                    if (isset($content['logoFile'])) {
                        $logo = $content['logoFile'];
                        $slugLogoName = $slugger->slug($content['name']);
                        $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
                        $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
                        $partner->setLogo($newLogoName);
                    }
                    //Envoie d'un mail au contact du partenaire modifié pour lui indiquer les modifications effectuées
                    (new Mail())->editPartner($partner->getName(), $partner->getDescription(), $user->getFirstname(), $user->getLastname(), $user->getPhone(), $user->getEmail());
                    
                } else {
                    //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification du partenaire
                    $errorsJson = $serializer->serialize($errors, 'json');
                    $response = new Response($errorsJson, 500, [
                        'Content-Type' => 'application/json'
                    ]);
                    
                    return $response;
                }
            }
            //Mise à jour du partenaire modifié
            $this->entityManager->persist($partner);
            //Mise à jour de la base de donnée avec les modification du partenaire et/ou de l'utilisateur
            $this->entityManager->flush();
    
            //Création de la réponse pour renvoyer le json contenant les infos du partenaire modifié
            $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:edit']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
    
            return $response;
        }
    }

    #[Route('/api/partner/{id}/delete', name: 'partner_delete', methods: ['DELETE'])]
    public function deletePartner(SerializerInterface $serializer, $id, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Recherche du partenaire concerné par la suppression en fonction de l'id
            $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);
    
            //Suppression des clubs dépendant du partenaire concerné par la suppression
            foreach ($partner->getClubs() as $club) {
                //Suppression des relations ClubPermission par club
                foreach ($club->getClubPermissions() as $clubPermission) {
                    $this->entityManager->remove($clubPermission);
                }
                //Suppression de la photo du club
                $picture = $club->getPicture();
                $picturePath = '../public/uploads/' . $picture;
                if (file_exists($picturePath)) {
                    unlink($picturePath);
                }
                $clubManager = $club->getManager();
                //Suppression du manager
                $this->entityManager->remove($clubManager);
                //Suppression du club
                $this->entityManager->remove($club);
            }        
            
            //Suppression des relations Partenaire et Permission
            foreach($partner->getPartnerPermissions() as $partnerPermission) {
                $this->entityManager->remove($partnerPermission);
            }
            
            //Suppression du logo du partenaire
            $logo = $partner->getLogo();
            $logoPath = '../public/uploads/' . $logo;
            if (file_exists($logoPath)) {
                unlink($logoPath);
            }
    
            //suppression du contact du partenaire
            $this->entityManager->remove($partner->getContact());
    
            //Suppression du partenaire
            $this->entityManager->remove($partner);
    
            // Mise à jour de la base de donnée
            $this->entityManager->flush();
    
            //Création de la réponse pour renvoyer le json contenant les infos du partenaire supprimé
            $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:edit']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
    
            //Envoie d'un mail au contact du partenaire supprimé pour lui indiquer la suppression
            (new Mail())->deletePartner($partner->getName(), $partner->getContact()->getFirstname(), $partner->getContact()->getEmail());
            
            return $response;
        }
    }
}
