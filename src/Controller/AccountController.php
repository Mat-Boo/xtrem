<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Class\Mail;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class AccountController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route(path: '/api/user', name: 'api_user', methods: ['GET'])]
    public function getConnectedUser(SerializerInterface $serializer, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            $user = $this->getUser();
    
            //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur connecté
            $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            return $response;
        }
    }

    #[Route(path: '/api/user/edit', name: 'api_user_edit', methods: ['POST'])]
    public function editConnectedUser(Request $request, SerializerInterface $serializer, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de modification d'un utilisateur
            $content = [];
            $content['firstname'] = $request->get('firstname');
            $content['lastname'] = $request->get('lastname');
            $content['email'] = $request->get('email');
            if ($request->get('phone') !== null) {
                $content['phone'] = $request->get('phone');
            }
            
            //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification des informations personnelles de l'utilisateur
            $errorsValidation  = new ErrorsValidation($content);
            $errors = $errorsValidation->formItemControl();
    
            //Recherche de l'utilisateur connecté
            /** @var $user User */
            $user = $this->getUser();
    
            //Recherche de l'utilisateur par l'email renseigné dans le formulaire pour vérifier si il n'existe pas en base de donnée
            $search_email = $this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
            if ($search_email && $search_email->getEmail() !== $user->getEmail()) {
                $errors['email'] = 'L\'email renseigné est déjà présent en base de données';
            }
    
            if (empty($errors)) {
                //Mise à jour de l'utilisateur
                $user->setFirstname($content['firstname']);
                $user->setLastname($content['lastname']);
                $user->setEmail($content['email']);
                if (isset($content['phone'])) {
                    $user->setPhone($content['phone']);
                }
                $this->entityManager->flush();
    
                //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur modifié
                $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
                $response = new Response($json, 200, [
                    'Content-Type' => 'application/json'
                ]);
            } else {
                //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification des informations personnelles de l'utilisateur
                $errorsJson = $serializer->serialize($errors, 'json');
                $response = new Response($errorsJson, 500, [
                    'Content-Type' => 'application/json'
                ]);
            }
            return $response;
        }
    }

    #[Route(path: '/api/user/modify-password', name: 'api_user_modify_password', methods: ['POST'])]
    public function modifyPassword(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Récupération des données issues du formulaire de modification de mot de passe
            $content = [];
            $content['actualPassword'] = $request->get('actualPassword');
            $content['password'] = $request->get('password');
            $content['passwordConfirm'] = $request->get('passwordConfirm');
            
            //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification du mot de passe de l'utilisateur
            $errorsValidation  = new ErrorsValidation($content);
            $errors = $errorsValidation->formItemControl();
    
            //Recherche de l'utilisateur connecté
            /** @var $user User */
            $user = $this->getUser();
            
            if (!$hasher->isPasswordValid($user, $content['actualPassword'])) {
                $errors['actualPassword'] = 'Votre mot de passe actuel est incorrect.';
            }
        
            if (empty($errors)) {
                //Mise à jour du mot de passe de l'utilisateur après hashage
                $password = $hasher->hashPassword($user, $content['password']);
                $user->setPassword($password);
                $this->entityManager->flush();
    
                //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur dont le mot de passe a été modifié
                $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
                $response = new Response($json, 200, [
                    'Content-Type' => 'application/json'
                ]);
           } else {
                //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification du mot de passe de l'utilisateur
                $errorsJson = $serializer->serialize($errors, 'json');
                $response = new Response($errorsJson, 500, [
                    'Content-Type' => 'application/json'
                ]);
           }
           return $response;
        }
    }

    #[Route(path: '/api/user/create-password/{uuid}', name: 'api_user_create_password', methods: ['POST'])]
    public function createPassword(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher, $uuid): Response
    {
        //Récupération des données issues du formulaire de modification de mot de passe
        $content = [];
        $content['password'] = $request->get('password');
        $content['passwordConfirm'] = $request->get('passwordConfirm');
        
        //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification du mot de passe de l'utilisateur
        $errorsValidation  = new ErrorsValidation($content);
        $errors = $errorsValidation->formItemControl();

        //Recherche de l'utilisateur connecté
        $user = $this->entityManager->getRepository(User::class)->findOneByUuid($uuid);
    
        if (empty($errors)) {
            //Mise à jour du mot de passe de l'utilisateur après hashage
            $password = $hasher->hashPassword($user, $content['password']);
            $user->setPassword($password);
            $user->setHasCreatedPwd(1);
            $this->entityManager->flush();

            //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur dont le mot de passe a été modifié
            $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
       } else {
            //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification du mot de passe de l'utilisateur
            $errorsJson = $serializer->serialize($errors, 'json');
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
       }
       return $response;
    }

    #[Route(path: '/api/user/{id}/reset', name: 'api_user_reset', methods: ['POST'])]
    public function resetAccess(SerializerInterface $serializer, $id, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') && $request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            //Recherche de l'utilisateur concerné
            $user = $this->entityManager->getRepository(User::class)->findOneById($id);
        
            //Mise à blanc du mot de passe
            $user->setHasCreatedPwd(0);
            $user->setPassword('');
            $this->entityManager->flush();
            
            //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur dont le mot de passe a été modifié
            $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
    
            //Envoie d'un mail à l'utilisateur pour lui transmettre le lien de création de mot de passe
            (new Mail())->resetAccess($user->getFirstname(), $user->getEmail(), $user->getUuid());
    
           return $response;
        }
    }

    #[Route(path: '/api/user/forgotten-password', name: 'api_user_forgotten_password', methods: ['POST'])]
    public function forgottenPwd(Request $request, SerializerInterface $serializer): Response
    {
        $content['email'] = $request->get('email');
        
        //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification du mot de passe de l'utilisateur
        $errorsValidation  = new ErrorsValidation($content);
        $errors = $errorsValidation->formItemControl();

        //Recherche de l'utilisateur concerné grâce à son email
        $user = $this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
        if (!$user) {
            $errors['email'] = 'L\'email renseigné n\'existe pas.';
        }

        if (empty($errors)) {          
            //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur dont le mot de passe a été modifié
            $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
     
            //Envoie d'un mail à l'utilisateur pour lui transmettre le lien de création de mot de passe
            (new Mail())->forgottenPwd($user->getFirstname(), $user->getEmail(), $user->getUuid());
       } else {
            //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification du mot de passe de l'utilisateur
            $errorsJson = $serializer->serialize($errors, 'json');
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
       }


       return $response;
    }

    #[Route(path: '/api/csrf', name: 'api_csrf', methods: ['GET'])]
    public function getCsrf(SerializerInterface $serializer, Session $session): Response
    {
        //Génère un token CSRF
        $tokenProvider = $this->container->get('security.csrf.token_manager');
        $session->set('csrf_token', $tokenProvider->getToken('token_id')->getValue());

        //Création de la réponse pour renvoyer le json contenant le token CSRF
        $json = $serializer->serialize($session->get('csrf_token'), 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        return $response;
    }
}
