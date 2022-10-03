<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
    public function getConnectedUser(SerializerInterface $serializer): Response
    {
        $user = $this->getUser();

        //Création de la réponse pour renvoyer le json contenant les infos de l'utilisateur connecté
        $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        return $response;
    }

    #[Route(path: '/api/user/edit', name: 'api_user_edit', methods: ['POST'])]
    public function editConnectedUser(Request $request, SerializerInterface $serializer): Response
    {
        //Récupération des données issues du formulaire de création d'une permission
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

    #[Route(path: '/api/user/modify-password', name: 'api_user_modify_password', methods: ['POST'])]
    public function modifyPassword(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher): Response
    {
        //Récupération des données issues du formulaire de création d'une permission
        $content = [];
        $content['actualPassword'] = $request->get('actualPassword');
        $content['password'] = $request->get('password');
        $content['passwordConfirm'] = $request->get('passwordConfirm');
        
        //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification du mot de passe de l'utilisateur
        $errorsValidation  = new ErrorsValidation($content);
        $errors = $errorsValidation->formItemControl();

        //Recherche de l'utilisateur connecté
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