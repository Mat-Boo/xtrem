<?php

namespace App\Controller;

use App\Entity\Partner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class PartnerController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    /* #[Route('/partner', name: 'app_partner')]
    public function index(): Response
    {
        return $this->render('partner/index.html.twig', [
            'controller_name' => 'PartnerController',
        ]);
    } */

    #[Route('/api/partners', name: 'partners')]
    public function getPartners(SerializerInterface $serializer): Response
    {
        $partners = $this->entityManager->getRepository(Partner::class)->findAll();
        $json = $serializer->serialize($partners, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }
}
