<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface as SerializerSerializerInterface;

class UserController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/userPartner/{email}', name: 'userPartner', methods: ['GET'])]
    public function getUserPartner(SerializerSerializerInterface $serializer, $email): Response
    {
        //Récupération de l'utilisateur par son email
        $user = $this->entityManager->getRepository(User::class)->findOneByEmail($email);

        //Création de la réponse pour renvoyer le json contenant le partenaire associé à l'utilisateur connecté
        $json = $serializer->serialize($user, 'json', ['groups' => 'userPartner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/userClub/{email}', name: 'userClub', methods: ['GET'])]
    public function getUserClub(SerializerSerializerInterface $serializer, $email): Response
    {
        //Récupération de l'utilisateur par son email
        $user = $this->entityManager->getRepository(User::class)->findOneByEmail($email);

        //Création de la réponse pour renvoyer le json contenant le club associé à l'utilisateur connecté
        $json = $serializer->serialize($user, 'json', ['groups' => 'userClub:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
