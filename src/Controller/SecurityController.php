<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): Response
    {
        $user = $this->getUser();
        $partner = null;
        if ($user->getPartner() !== null) {
            $partner = [
                'id' => $user->getPartner()->getId(),
                'name' => $user->getPartner()->getName(),
                'logo' => $user->getPartner()->getLogo(),
                'description' => $user->getPartner()->getDescription(),
            ];
        }
        return $this->json([
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'phone' => $user->getPhone(),
            'partner' => $partner,
            'club' => $user->getClub(),
            'roles' => $user->getRoles()
        ]);
    }

    #[Route(path: '/api/connected-user', name: 'api_cionnected_user', methods: ['GET'])]
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

    #[Route(path: '/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): void
    {
        
    }
}
