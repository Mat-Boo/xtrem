<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Entity\PartnerPermission;
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
        //Récupération de toutes les permissions en base de données
        $permissions = $this->entityManager->getRepository(Permission::class)->findAll();

        //Création de la réponse pour renvoyer le json contenant toutes les permissions
        $json = $serializer->serialize($permissions, 'json', ['groups' => 'permission:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permission/{id}', name: 'permission', methods: ['GET'])]
    public function getPermission(SerializerInterface $serializer, $id): Response
    {
        //Recherche d'une permission en fonction de l'id
        $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);

        //Création de la réponse pour renvoyer le json contenant les infos de la permission trouvée
        $json = $serializer->serialize($permission, 'json', ['groups' => 'permission:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/permission/create', name: 'permission_create', methods: ['POST'])]
    public function createPermission(Request $request, SerializerInterface $serializer): Response
    {
        //Récupération des données issues du formulaire de création d'une permission
        $content = [];
        $content['name'] = $request->get('name');
        $content['description'] = $request->get('description');

        //Application de la fonction de contrôle des champs renseignés dans le formulaire de création d'une permission
        $errorsValidation  = new ErrorsValidation($content);
        $errors = $errorsValidation->formItemControl();

        if (empty($errors)) {
            //création de la nouvelle instance Permission
            $permission = new Permission;
            $permission->setName($content['name']);
            $permission->setDescription($content['description']);
    
            //Mise à jour de la base de donnée avec la nouvelle permission
            $this->entityManager->persist($permission);
            $this->entityManager->flush();
    
            //Création de la réponse pour renvoyer le json contenant les infos de la nouvelle permission
            $json = $serializer->serialize($permission, 'json');
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
        } else {
            //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de création d'une permission
            $errorsJson = $serializer->serialize($errors, 'json', ['groups' => 'permission:read']);
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
        }
        
        return $response;
    }

    #[Route('/api/permission/{id}/edit', name: 'permission_edit', methods: ['POST'])]
    public function editPermission(Request $request, SerializerInterface $serializer, $id): Response
    {
        //Récupération des données issues du formulaire de création d'une permission
        $content = [];
        $content['name'] = $request->get('name');
        $content['description'] = $request->get('description');
        
        //Application de la fonction de contrôle des champs renseignés dans le formulaire de modification de la permission
        $errorsValidation  = new ErrorsValidation($content);
        $errors = $errorsValidation->formItemControl();

        if (empty($errors)) {
            //Recherche de la permission concernée par la modification en fonction de l'id
            $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);
            
            //Mise à jour de la Permission
            $permission->setName($content['name']);
            $permission->setDescription($content['description']);
            $this->entityManager->flush();

            //Création de la réponse pour renvoyer le json contenant les infos de la permission modifiée
            $json = $serializer->serialize($permission, 'json', ['groups' => 'permission:read']);
            $response = new Response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
        } else {
            //Création de la réponse pour renvoyer le json contenant les erreurs liées au remplissage du formulaire de modification d'une permission
            $errorsJson = $serializer->serialize($errors, 'json');
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
        }
        return $response;
    }

    #[Route('/api/permission/{id}/delete', name: 'permission_delete', methods: ['PUT'])]
    public function deletePermission(SerializerInterface $serializer, $id): Response
    {
        //Recherche des relations PartnerPermission dont la permission est concernée par la suppression
        $partnersPermissions = $this->entityManager->getRepository(PartnerPermission::class)->findByPermission($id);

        //Mise à jour de la base de donnée en supprimant les relations Partenaire et Permission
        foreach($partnersPermissions as $partnerPermission) {
            $this->entityManager->remove($partnerPermission);
        }
        $this->entityManager->flush();

        //Recherche de la permission concernée par la suppression en fonction de l'id
        $permission = $this->entityManager->getRepository(Permission::class)->findOneById($id);

        //Mise à jour de la base de donnée en supprimant la permission
        $this->entityManager->remove($permission);
        $this->entityManager->flush();

        //Création de la réponse pour renvoyer le json contenant les infos de la permissions supprimée
        $json = $serializer->serialize($permission, 'json', ['groups' => 'permission:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
