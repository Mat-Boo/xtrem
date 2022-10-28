<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface as SerializerSerializerInterface;

class UserController extends AbstractController
{
    #[Route('/api/user-partner/', name: 'user_partner', methods: ['GET'])]
    public function getUserPartner(SerializerSerializerInterface $serializer, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            /** @var $user User */
            $user = $this->getUser();
    
            //Création de la réponse pour renvoyer le json contenant le partenaire associé à l'utilisateur connecté
            $json = $serializer->serialize($user, 'json', ['groups' => 'userPartner:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
            return $response;
        }
    }

    #[Route('/api/user-club/', name: 'user_club', methods: ['GET'])]
    public function getUserClub(SerializerSerializerInterface $serializer, Request $request, Session $session): Response
    {
        if ($request->headers->get('x-csrf-token') === $session->get('csrf_token')) {
            /** @var $user User */
            $user = $this->getUser();
    
            //Création de la réponse pour renvoyer le json contenant le club associé à l'utilisateur connecté
            $json = $serializer->serialize($user, 'json', ['groups' => 'userClub:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
            
            return $response;
        }
    }
}
