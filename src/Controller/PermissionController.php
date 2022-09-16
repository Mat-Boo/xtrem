<?php

namespace App\Controller;

use App\Entity\Permission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class PermissionController extends AbstractController
{
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/permissions', name: 'permissions', methods: ['GET'])]
    public function getPartners(SerializerInterface $serializer): Response
    {
        $permissions = $this->entityManager->getRepository(Permission::class)->findAll();
        $json = $serializer->serialize($permissions, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
