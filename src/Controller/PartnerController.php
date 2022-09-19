<?php

namespace App\Controller;

use App\Class\ErrorsValidation;
use App\Entity\Partner;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

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
    public function createPartner(Request $request, SerializerInterface $serializer, UserPasswordHasherInterface $hasher, SluggerInterface $slugger): Response
    {
        $content = [];
        $content['name'] = $request->get('name');
        $content['logoFile'] = $request->files->get('logoFile');
        $content['logoFileName'] = $request->get('logoFileName');
        $content['description'] = $request->get('description');
        $content['firstname'] = $request->get('firstname');
        $content['lastname'] = $request->get('lastname');
        $content['phone'] = $request->get('phone');
        $content['email'] = $request->get('email');
        $content['password'] = $request->get('password');
        $content['passwordConfirm'] = $request->get('passwordConfirm');

        $errorsValidation  = new ErrorsValidation($content);
        
        $errors = $errorsValidation->formItemControl();

        if (empty($errors)) {
            $user = new User;
    
            $search_email =$this->entityManager->getRepository(User::class)->findOneByEmail($content['email']);
                if (!$search_email) {
                    $user->setFirstname(ucfirst(strtolower($content['firstname'])));
                    $user->setLastname(ucfirst(strtolower($content['lastname'])));
                    $user->setPhone($content['phone']);
                    $user->setEmail($content['email']);
                    $user->setRoles(['ROLE_PARTNER']);
            
                    //Hashage du mot de passe                
                    $password = $hasher->hashPassword($user, $content['password']);
                    $user->setPassword($password);
            
                    $this->entityManager->persist($user);
                    $this->entityManager->flush();
                }
    
            //Copie du logo du partenaire dans le dossier uploads (avec renommage du fichier par avec le nom du partenaire sluggé)
            $logo = $content['logoFile'];
            $logoName = pathinfo($content['logoFileName'], PATHINFO_FILENAME);
            $slugLogoName = $slugger->slug($content['name']);
            $newLogoName = strtolower($slugLogoName . '.' . $logo->guessExtension());
            $logo->move($this->getParameter('files_directory'), $newLogoName); //file_directory paramétré dans le fichier config/services.yaml
    
            $partner = new Partner;
            $partner->setName(ucfirst(strtolower($content['name'])));
            $partner->setLogo($newLogoName);
            $partner->setDescription(ucfirst(strtolower($content['description'])));
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
            
        } else {
            $errorsJson = $serializer->serialize($errors, 'json');
            $response = new Response($errorsJson, 500, [
                'Content-Type' => 'application/json'
            ]);
        }

        
        return $response;
    }

}
