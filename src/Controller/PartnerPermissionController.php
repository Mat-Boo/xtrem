<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class PartnerPermissionController extends AbstractController
{
    /* private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/partner-permissions/{id}', name: 'partner-permissions', methods: ['GET'])]
    public function getPartner(Request $request, SerializerInterface $serializer, $id): Response
    {
        //Recherche d'une partenaire-permissions en fonction de l'id
        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    } */
}
