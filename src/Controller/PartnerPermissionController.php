<?php

namespace App\Controller;

use App\Entity\PartnerPermission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class PartnerPermissionController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/partner-permission/{idPartner}/{idPermission}/edit', name: 'partner-permission_edit', methods: ['POST'])]
    public function getPartner(Request $request, SerializerInterface $serializer, $idPartner, $idPermission): Response
    {
        //Récupération des données issues du formulaire de modification d'un partenaire
        $content['isActive'] = $request->get('isActive');

        //Recherche d'une relation partenaire-permissions en fonction de l'id du partenaire et de l'id de la permission
        $partnerPermission = $this->entityManager->getRepository(PartnerPermission::class)->findOneByIdPartnerAndIdPermission($idPartner, $idPermission);

        //Mise à jour de la relation partenaire-permission
        $partnerPermission[0]->setIsActive($content['isActive']);
        $this->entityManager->flush();

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($partnerPermission, 'json', ['groups' => 'partnerPermission:edit']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
