<?php

namespace App\Controller;

use App\Entity\Partner;
use App\Entity\User;
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
    public function editPartner(Request $request, $id, SerializerInterface $serializer)
    {
        $content = json_decode($request->getContent());
        
        $partner = $this->entityManager->getRepository(Partner::class)->findOneById($id);

        $partner->setIsActive($content->isActive);
        $this->entityManager->flush();

        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

    #[Route('/api/partner/create', name: 'partner_create', methods: ['POST'])]
    public function createPartner(Request $request, SerializerInterface $serializer): Response
    {
        $content = json_decode($request->getContent());

        $user = new User;
        $user->setFirstname($content->formValues->firstname);
        $user->setLastname($content->formValues->lastname);
        $user->setPhone($content->formValues->phone);
        $user->setEmail($content->formValues->email);
        $user->setPassword($content->formValues->password);
        $user->setRoles(['ROLE_PARTNER']);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $partner = new Partner;
        $partner->setName($content->formValues->name);
        $partner->setLogo($content->formValues->logo);
        $partner->setDescription($content->formValues->description);
        $partner->setIsActive(true);
        $partner->setContact($user);

        $this->entityManager->persist($partner);
        $this->entityManager->flush();
        
        $user->setPartner($partner);
        $this->entityManager->flush();

        $json = $serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        $response = new Response($json, 200, [
            'Content-Type' => 'application/json'
        ]);
        
        return $response;
    }

}
