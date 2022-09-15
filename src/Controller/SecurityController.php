<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    #[Route(path: '/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): Response
    {
        $user = $this->getUser();
        $partner = null;
        if ($user->getPartner() !== null) {
            $partner = [
                'id' => $user->getPartner()->getId(),
                'name' => $user->getPartner()->getName(),
                'logo' => $user->getPartner()->getLogo(),
                'description' => $user->getPartner()->getDescription(),
            ];
        }
        return $this->json([
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'phone' => $user->getPhone(),
            'partner' => $partner,
            'club' => $user->getClub(),
            'roles' => $user->getRoles()
        ]);
    }

    /* #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    } */
}