<?php

namespace App\Controller;

use App\Class\Mail;
use App\Entity\ClubPermission;
use App\Entity\Partner;
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

    #[Route('/api/partner-permission/{idPartner}/{idPermission}', name: 'partner-permission', methods: ['GET'])]
    public function getPartnerPermission(SerializerInterface $serializer, $idPartner, $idPermission): Response
    {
        //Recherche d'une relation partenaire-permissions en fonction de l'id du partenaire et de l'id de la permission
        $partnerPermission = $this->entityManager->getRepository(PartnerPermission::class)->findOneByIdPartnerAndIdPermission($idPartner, $idPermission);

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($partnerPermission, 'json', ['groups' => 'partnerPermission:edit']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner-permission/{idPartner}/{idPermission}/edit', name: 'partner-permission_edit', methods: ['POST'])]
    public function editPartnerPermission(Request $request, SerializerInterface $serializer, $idPartner, $idPermission): Response
    {
        //Récupération des données issues du formulaire de modification d'un partenaire
        $content['isActive'] = $request->get('isActive');

        //Recherche d'une relation partenaire-permissions en fonction de l'id du partenaire et de l'id de la permission
        $partnerPermission = $this->entityManager->getRepository(PartnerPermission::class)->findOneByIdPartnerAndIdPermission($idPartner, $idPermission);

        //Mise à jour de la relation partenaire-permission
        $partnerPermission[0]->setIsActive($content['isActive']);

        //Envoie d'un mail au contact du partenaire pour lui indiquer l'activation ou la désactivation de la permission
        (new Mail())->togglePartnerPermission(
            $content['isActive'],
            $partnerPermission[0]->getPermission()->getName(),
            $partnerPermission[0]->getPartner()->getName(),
            $partnerPermission[0]->getPartner()->getContact()->getFirstname(),
            $partnerPermission[0]->getPartner()->getContact()->getEmail());

        //Impact sur les clubs
        //Recherche de toutes les relations clubs-permissions contenant la permission modifiée du partenaire concerné
        $clubsPermissions = $this->entityManager->getRepository(ClubPermission::class)->findByPartnerPermission($partnerPermission);

        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($idPartner);

        if ($clubsPermissions) {
            foreach($clubsPermissions as $clubPermission) {
                $this->entityManager->remove($clubPermission);
            }
        } else {
            foreach($partner->getClubs() as $club) {
                $clubPermission = new ClubPermission;
                $clubPermission->setClub($club);
                $clubPermission->setPartnerPermissions($partnerPermission[0]);
                $clubPermission->setIsActive(false);
                $this->entityManager->persist($clubPermission);
            }
        }

        $this->entityManager->flush();

        //Création de la réponse pour renvoyer le json contenant les infos du partenaire trouvé
        $json = $serializer->serialize($partnerPermission, 'json', ['groups' => 'partnerPermission:edit']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);

        
        
        return $response;
    }
}
