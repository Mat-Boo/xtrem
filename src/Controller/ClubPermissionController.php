<?php

namespace App\Controller;

use App\Class\Mail;
use App\Entity\ClubPermission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ClubPermissionController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/club-permission/{idClub}/{idPartnerPermission}/edit', name: 'club-permission_edit', methods: ['POST'])]
    public function editClubPermission(Request $request, SerializerInterface $serializer, $idClub, $idPartnerPermission): Response
    {
        //Récupération des données issues du formulaire de modification d'un club
        $content['isActive'] = $request->get('isActive');

        //Recherche d'une relation partenaire-permissions en fonction de l'id du partenaire et de l'id de la permission
        $clubPermission = $this->entityManager->getRepository(ClubPermission::class)->findByClubAndPartnerPermission($idClub, $idPartnerPermission);

        //Mise à jour de la relation partenaire-permission
        $clubPermission[0]->setIsActive($content['isActive']);

        $this->entityManager->flush();

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($clubPermission, 'json', ['groups' => 'clubPermission:edit']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);

        //Envoie d'un mail au manager du club pour l'informer de l'activation ou désactivation de la permission
        //Et envoie d'un mail aussi au contact de son partenaire pour le prévenir de cette activation ou désactivation
        (new Mail())->toggleClubPermission(
            $content['isActive'],
            $clubPermission[0]->getPartnerPermissions()->getPermission()->getName(),
            $clubPermission[0]->getClub()->getName(),
            $clubPermission[0]->getClub()->getManager()->getFirstname(),
            $clubPermission[0]->getClub()->getManager()->getLastname(),
            $clubPermission[0]->getClub()->getManager()->getEmail(),
            $clubPermission[0]->getClub()->getPartner()->getcontact()->getFirstname(),
            $clubPermission[0]->getClub()->getPartner()->getcontact()->getEmail());
        
        return $response;
    }
}
