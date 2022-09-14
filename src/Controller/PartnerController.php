<?php

namespace App\Controller;

use App\Entity\Partner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class PartnerController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/partners', name: 'partners', methods: ['GET'])]
    public function getPartners(SerializerInterface $serializer): Response
    {
        $partners = $this->entityManager->getRepository(Partner::class)->findAll();
        $json = $serializer->serialize($partners, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner/{id}/edit', name: 'partner_edit', methods: ['PUT'])]
    public function editPartner(Request $request, $id)
    {
        $content = json_decode($request->getContent());
        
        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);

        $partner->setIsActive($content->isActive);
        $this->entityManager->flush();
    }

    /* #[Route('/api/partner/create', name: 'partner_create', methods: ['POST'])]
    public function createPartner(Request $request)
    {
        $content = json_decode($request->getContent());
        
        $partner = new Partner;

        $partner->setIsActive($content->isActive);
        $this->entityManager->flush();
    } */
}
