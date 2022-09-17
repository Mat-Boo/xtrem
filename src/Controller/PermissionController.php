<?php

namespace App\Controller;

use App\Entity\Permission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class PermissionController extends AbstractController
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/permissions', name: 'permissions', methods: ['GET'])]
    public function getPermissions(SerializerInterface $serializer): Response
    {
        $permissions = $this->entityManager->getRepository(Permission::class)->findAll();
        $json = $serializer->serialize($permissions, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permissions/{id}', name: 'permission', methods: ['GET'])]
    public function getPermission(Request $request, SerializerInterface $serializer, $id): Response
    {
        $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);
        $json = $serializer->serialize($permission, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permissions/create', name: 'permission_create', methods: ['POST'])]
    public function createPermission(Request $request, SerializerInterface $serializer): Response
    {
        $content = json_decode($request->getContent());

        $permission = new Permission;
        $permission->setName($content->formValues->name);
        $permission->setDescription($content->formValues->description);

        $this->entityManager->persist($permission);
        $this->entityManager->flush();

        $json = $serializer->serialize($permission, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permissions/{id}/edit', name: 'permission_edit', methods: ['PUT'])]
    public function editPermission(Request $request, SerializerInterface $serializer, $id): Response
    {
        $content = json_decode($request->getContent());

        $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);
        $permission->setName($content->formValues->name);
        $permission->setDescription($content->formValues->description);

        $this->entityManager->flush();

        $json = $serializer->serialize($permission, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permissions/{id}/delete', name: 'permission_delete', methods: ['PUT'])]
    public function deletePermission(Request $request, SerializerInterface $serializer, $id): Response
    {
        $content = json_decode($request->getContent());

        $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);
        $this->entityManager->remove($permission);
        $this->entityManager->flush();

        $json = $serializer->serialize($permission, 'json');
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
