<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Entity\Club;
use App\Entity\ClubPermission;
use App\Entity\Partner;
use App\Entity\PartnerPermission;
use App\Entity\Permission;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class PartnerController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/partners', name: 'partners', methods: ['GET'])]
    public function getPartners(SerializerInterface $serializer): Response
    {
        //Récupération de tous les partenaires en base de données
        $partners = $this->entityManager->getRepository(Partner::class)->findAll();

        //Création de la réponse pour renvoyer le json contenant tous les partenaires
        $json = $serializer->serialize($partners, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner/{id}', name: 'partner', methods: ['GET'])]
    public function getPartner(Request $request, SerializerInterface $serializer, $id): Response
    {
        //Recherche d'un partenaire en fonction de l'id
        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner/{id}/edit', name: 'partner_edit', methods: ['POST'])]
    public function editPartner(Request $request, $id, SerializerInterface $serializer, SluggerInterface $slugger)
    {
        //Récupération des données issues du formulaire de création d'un partenaire
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
                $content['firstname'] !== $user->getFirstname() ? $user->setFirstname(ucfirst(strtolower($content['firstname']))) : null;
                $content['lastname'] !== $user->getLastname() ? $user->setLastname(ucfirst(strtolower($content['lastname']))) : null;
                $content['phone'] !== $user->getPhone() ? $user->setPhone($content['phone']) : null;
                $content['email'] !== $user->getEmail() ? $user->setEmail($content['email']) : null;
                //Mise à jour de l'utilisateur modifié et du partenaire modifié
                $this->entityManager->persist($user);
                
                //Modification du partenaire en vérifiant si le champs concerné a été modifié
                $content['name'] !== $partner->getName() ? $partner->setName(ucfirst(strtolower($content['name']))) : null;
                $content['description'] !== $partner->getDescription() ? $partner->setDescription(ucfirst(strtolower($content['description']))) : null;
                //Copie du logo du partenaire dans le dossier uploads (avec renommage du fichier avec le nom du partenaire sluggé) si modifié
                if (isset($content['logoFile'])) {
                    $logo = $content['logoFile'];
                    $slugLogoName = $slugger->slug($content['name']);
                    $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
                    $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
                    $partner->setLogo($newLogoName);
                }
            } else {
                //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de création d'un partenaire
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
        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner/create', name: 'partner_create', methods: ['POST'])]
    public function createPartner(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher, SluggerInterface $slugger): Response
    {
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
        $content['password'] = $request->get('password');
        $content['passwordConfirm'] = $request->get('passwordConfirm');
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
            $user->setFirstname(ucfirst(strtolower($content['firstname'])));
            $user->setLastname(ucfirst(strtolower($content['lastname'])));
            $user->setPhone($content['phone']);
            $user->setEmail($content['email']);
            $user->setRoles(['ROLE_PARTNER']);
    
            //Hashage du mot de passe                
            $password = $hasher->hashPassword($user, $content['password']);
            $user->setPassword($password);
    
            //Copie du logo du partenaire dans le dossier uploads (avec renommage du fichier avec le nom du partenaire sluggé)
            $logo = $content['logoFile'];
            $slugLogoName = $slugger->slug($content['name']);
            $newLogoName = strtolower('partner_' + $slugLogoName . '.' . $logo->guessExtension());
            $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
    
            //Création de la nouvelle instance Partner
            $partner = new Partner;
            $partner->setName(ucfirst(strtolower($content['name'])));
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
            $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
        } else {
            //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de création d'un partenaire
            $errorsJson = $serializer->serialize($errors, 'json');
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
        }
        return $response;
    }

    #[Route('/api/partner/{id}/delete', name: 'partner_delete', methods: ['POST'])]
    public function deletePartner(SerializerInterface $serializer, $id): Response
    {
        //Recherche des relations PartnerPermission dont le partenaire est concernée par la suppression
        $partnersPermissions = $this->entityManager->getRepository(PartnerPermission::class)->findByPartner($id);

        //Mise à jour de la base de donnée en supprimant les relations Partenaire et Permission
        foreach($partnersPermissions as $partnerPermission) {
            $this->entityManager->remove($partnerPermission);
        }

        //Recherche du partenaire concerné par la suppression en fonction de l'id
        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);

        //Mise à jour de la base de donnée en supprimant le partenaire
        $this->entityManager->remove($partner);

        $this->entityManager->flush();

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire supprimé
        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    //**************************************************//
    //Manage Clubs

    #[Route('/api/partner/{id}/clubs/create', name: 'partner_club_create', methods: ['POST'])]
    public function createClub(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher, SluggerInterface $slugger, $id): Response
    {
        //Récupération des données issues du formulaire de création d'un partenaire
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
        $content['password'] = $request->get('password');
        $content['passwordConfirm'] = $request->get('passwordConfirm');
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
            $user->setFirstname(ucfirst(strtolower($content['firstname'])));
            $user->setLastname(ucfirst(strtolower($content['lastname'])));
            $user->setPhone($content['phone']);
            $user->setEmail($content['email']);
            $user->setRoles(['ROLE_CLUB']);
    
            //Hashage du mot de passe                
            $password = $hasher->hashPassword($user, $content['password']);
            $user->setPassword($password);
    
            //Copie du logo du club dans le dossier uploads (avec renommage du fichier avec le nom du club sluggé)
            $logo = $content['logoFile'];
            $slugLogoName = $slugger->slug($content['name']);
            $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
            $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
    
            //Création de la nouvelle instance Club
            $club = new Club;
            $club->setName(ucfirst(strtolower($content['name'])));
            $club->setPicture($newLogoName);
            $club->setAddress(ucfirst(strtolower($content['address'])));
            $club->setZipCode($content['zipcode']);
            $club->setCity($content['city']);
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
    
            //Création de la réponse pour renvoyer le json contenant les infos du nouveau partenaire
            $json = $serializer->serialize($partner, 'json', ['groups' => 'club:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
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
