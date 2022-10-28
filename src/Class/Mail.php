<?php

namespace App\Class;
use Mailjet\Resources;
use Mailjet\Client;

class Mail {

    public function send($withBtn, $to_email, $to_name, $subject, $content)
    {
        $mj = new Client($_ENV['MJ_APIKEY_PUBLIC'], $_ENV['MJ_APIKEY_PRIVATE'],true,['version' => 'v3.1']);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "mathieubouthors@hotmail.com",
                        'Name' => "Xtrem"
                    ],
                    'To' => [
                        [
                            'Email' => $to_email,
                            'Name' => $to_name
                        ]
                    ],
                    'TemplateID' => $withBtn ? 4129346 : 4267792,
                    'TemplateLanguage' => true,
                    'Subject' => $subject,
                    'Variables' => [
                        'content' => $content
                    ]
                ]
            ]
        ];
        $response = $mj->post(Resources::$Email, ['body' => $body]);
        $response->success();
    }

    public function getUrl()
    {
        if ($_ENV['APP_ENV'] === 'dev') {
            $url = 'http://127.0.0.1:8000';
        } else {
            $url = 'https://xtrem-studi.fly.dev';
        }

        return $url;
    }

    //Mails concernant les contacts de partenaire
    public function createPartner($firstname, $email, $uuid)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Votre accès à l'interface Xtrem est opérationnel.<br/><br/>";
        $contentMail .= "Vous devez, maintenant, créer votre mot de passe personnel.<br/>";
        $contentMail .= "Pour celà, cliquez sur le lien suivant : <br/>";
        $contentMail .= "<a href='" . $this->getUrl() . "/{$uuid}/creer-mot-de-passe'>Créer mon mot de passe</a><br/><br/>";
        $contentMail .= "Vous retrouverez ensuite, sur votre espace, l'ensemble des informations du partenaire et les permissions mises en place et donc activable ou désactivable sur demande pour vos clubs.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $email, $firstname, 'Xtrem | Accès Interface', $contentMail);
    }

    public function editPartner($partnerName, $description, $firstname, $lastname, $phone, $email)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Les informations du partenaire <b>{$partnerName}</b> ont été mises à jour.<br/>";
        $contentMail .= "Veuillez trouver le récapitulatif de ces informations :<br/>";
        $contentMail .= "<ul>";
        $contentMail .= "<li>Nom : <b>{$partnerName}</b></li>";
        $contentMail .= "<li>Description : <b>{$description}</b></li>";
        $contentMail .= "</ul><br/>";
        $contentMail .= "Vos informations de contact : <br/>";
        $contentMail .= "<ul>";
        $contentMail .= "<li>Prénom : <b>{$firstname}</b></li>";
        $contentMail .= "<li>Nom : <b>{$lastname}</b></li>";
        $contentMail .= "<li>Téléphone : <b>{$phone}</b></li>";
        $contentMail .= "<li>Email : <b>{$email}</b></li>";
        $contentMail .= "</ul><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $email, $firstname, 'Xtrem | Modification d\'informations', $contentMail);
    }

    public function togglePartner($PartnerState, $partnerName, $firstname, $email)
    {
        if ($PartnerState === "0") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "Le partenaire <b>{$partnerName}</b> a été désactivé.<br/>";
            $contentMail .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(false, $email, $firstname, 'Xtrem | Accès désactivé', $contentMail);
        } else if ($PartnerState === "1") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "Le partenaire <b>{$partnerName}</b> a été activé.<br/>";
            $contentMail .= "Votre accès à notre interface a donc été activé aussi, vous pouvez donc vous connecter avec vos identifiants habituels.<br/><br/>";
            $contentMail .= "Vos clubs restent désactivés, veuillez nous contactez pour leur activation.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $email, $firstname, 'Xtrem | Accès activé', $contentMail);
        }
    }

    public function deletePartner($partnerName, $firstname, $email)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Le partenaire <b>{$partnerName}</b> a été supprimé de notre base de données.<br/>";
        $contentMail .= "Votre accès à notre interface a donc été clôturé.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $email, $firstname, 'Xtrem | Accès clôturé', $contentMail);
    }

    public function togglePartnerPermission($permissionState, $permissionName, $partnerName, $partnerFirstname, $partnerEmail, $clubName, $clubFirstname, $clubEmail)
    {
        if ($permissionState === "0") {
            if ($partnerEmail !== '') {
                $contentMail = "Bonjour {$partnerFirstname},<br/><br/>";
                $contentMail .= "La permission <b>{$permissionName}</b> a été désactivée pour le partenaire <b>{$partnerName}</b>.<br/>";
                $contentMail .= "L'ensemble de vos clubs n'auront donc plus accès à cette permission.<br/><br/>";
                $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
                $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send(true, $partnerEmail, $partnerFirstname, 'Xtrem | Permission désactivée', $contentMail);
            }

            if ($clubEmail !== '') {
                $contentMailClub = "Bonjour {$clubFirstname},<br/><br/>";
                $contentMailClub .= "La permission <b>{$permissionName}</b> a été désactivée sur votre partenaire <b>{$partnerName}</b>.<br/>";
                $contentMailClub .= "votre club <b>{$clubName}</b> n'aura donc plus accès à cette permission.<br/><br/>";
                $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
                $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send(true, $clubEmail, $clubFirstname, 'Xtrem | Permission désactivée', $contentMailClub);
            }


        } else if ($permissionState === "1") {
            $contentMail = "Bonjour {$partnerFirstname},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été activée pour le partenaire <b>{$partnerName}</b>.<br/>";
            $contentMail .= "Cette permission est dorénavant disponible mais inactive par défaut pour vos clubs.<br/>";
            $contentMail .= "Veuillez nous contactez pour l'activation sur l'un de vos clubs.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $partnerEmail, $partnerFirstname, 'Xtrem | Permission activée', $contentMail);
        }
    }

    //Mails concernant les managers de club et on prévient aussi le partenaire
    public function createClub($firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $uuidClub, $clubName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Votre accès à l'interface Xtrem est opérationnel.<br/><br/>";
        $contentMailClub .= "Vous devez, maintenant, créer votre mot de passe personnel.<br/>";
        $contentMailClub .= "Pour celà, cliquez sur le lien suivant : <br/>";
        $contentMailClub .= "<a href='" . $this->getUrl() . "/{$uuidClub}/creer-mot-de-passe'>Créer mon mot de passe</a><br/><br/>";
        $contentMailClub .= "Vous retrouverez ensuite, sur votre espace, l'ensemble des informations du club et les permissions mises en place et donc activable ou désactivable sur demande de votre partenaire.<br/><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès Interface', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été créé sur notre interface.<br/>";
        $contentMailPartner .= "Il apparaîtra dorénavant parmi vos clubs.<br/>";
        $contentMailPartner .= "Un mail a été envoyé au manager, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b> pour l'en informer et lui transmettre la procédure de connexion.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Création Club', $contentMailPartner);
    }

    public function editClub($firstnameManagerClub, $lastnameManagerClub, $phoneManagerClub, $emailManagerClub, $clubName, $clubAddress, $clubZipcode, $clubCity, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Les informations du club <b>{$clubName}</b> ont été mises à jour.<br/>";
        $contentMailClub .= "Veuillez trouver le récapitulatif de ces informations :<br/>";
        $contentMailClub .= "<ul>";
        $contentMailClub .= "<li>Nom : <b>{$clubName}</b></li>";
        $contentMailClub .= "<li>Adresse : <b>{$clubAddress}</b></li>";
        $contentMailClub .= "<li>Code postal : <b>{$clubZipcode}</b></li>";
        $contentMailClub .= "<li>Ville : <b>{$clubCity}</b></li>";
        $contentMailClub .= "</ul><br/>";
        $contentMailClub .= "Vos informations de contact : <br/>";
        $contentMailClub .= "<ul>";
        $contentMailClub .= "<li>Prénom : <b>{$firstnameManagerClub}</b></li>";
        $contentMailClub .= "<li>Nom : <b>{$lastnameManagerClub}</b></li>";
        $contentMailClub .= "<li>Téléphone : <b>{$phoneManagerClub}</b></li>";
        $contentMailClub .= "<li>Email : <b>{$emailManagerClub}</b></li>";
        $contentMailClub .= "</ul><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Modification Informations', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que les informations de votre club <b>{$clubName}</b> ont été mises à jour.<br/>";
        $contentMailPartner .= "Veuillez trouver le récapitulatif de ces informations :<br/>";
        $contentMailPartner .= "<ul>";
        $contentMailPartner .= "<li>Nom : <b>{$clubName}</b></li>";
        $contentMailPartner .= "<li>Adresse : <b>{$clubAddress}</b></li>";
        $contentMailPartner .= "<li>Code postal : <b>{$clubZipcode}</b></li>";
        $contentMailPartner .= "<li>Ville : <b>{$clubCity}</b></li>";
        $contentMailPartner .= "</ul><br/>";
        $contentMailPartner .= "Vos informations de contact : <br/>";
        $contentMailPartner .= "<ul>";
        $contentMailPartner .= "<li>Prénom : <b>{$firstnameManagerClub}</b></li>";
        $contentMailPartner .= "<li>Nom : <b>{$lastnameManagerClub}</b></li>";
        $contentMailPartner .= "<li>Téléphone : <b>{$phoneManagerClub}</b></li>";
        $contentMailPartner .= "<li>Email : <b>{$emailManagerClub}</b></li>";
        $contentMailPartner .= "</ul><br/>";
        $contentMailPartner .= "Un mail a été envoyé au manager, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b> pour l'en informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Modification Informations Club', $contentMailPartner);
    }

    public function toggleClub($clubState, $clubName, $firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $firstnameContactPartner, $emailContactPartner)
    {
        if ($clubState === "0") {
            $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMailClub .= "Le club <b>{$clubName}</b> a été désactivé.<br/>";
            $contentMailClub .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
            $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(false, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès désactivé', $contentMailClub);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été désactivé.<br/>";
            $contentMailPartner .= "Il est donc, dorénavant, impossible pour le manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, de se connecter à notre interface.<br/>";
            $contentMailPartner .= "Un mail lui a été envoyé pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club désactivé', $contentMailPartner);
        } else if ($clubState === "1") {
            $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMailClub .= "Le club <b>{$clubName}</b> a été activé.<br/>";
            $contentMailClub .= "Votre accès à notre interface a donc été activé aussi, vous pouvez donc vous connecter avec vos identifiants habituels.<br/><br/>";
            $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès activé', $contentMailClub);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été activé.<br/>";
            $contentMailPartner .= "Il est donc, dorénavant, possible pour le manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, de se connecter à notre interface.<br/>";
            $contentMailPartner .= "Un mail lui a été envoyé pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club activé', $contentMailPartner);
        }
    }

    public function deleteClub($firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $clubName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Le club <b>{$clubName}</b> a été supprimé de notre base de données.<br/>";
        $contentMailClub .= "Votre accès à notre interface a donc été clôturé.<br/><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès clôturé', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été supprimé de notre base de données.<br/>";
        $contentMailPartner .= "Un mail a été envoyé au manager, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b> pour l'en informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club clôturé', $contentMailPartner);
    }

    public function toggleClubPermission($permissionState, $permissionName, $clubName, $firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $firstnameContactPartner, $emailContactPartner)
    {
        if ($permissionState === "0") {
            $contentMail = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été désactivée pour votre club <b>{$clubName}</b>.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Permission désactivée', $contentMail);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que la permission <b>{$permissionName}</b> a été désactivée pour votre club <b>{$clubName}</b>.<br/>";
            $contentMailPartner .= "Un mail a été envoyé au manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Permission club désactivée', $contentMailPartner);
        } else if ($permissionState === "1") {
            $contentMail = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été activée pour votre club <b>{$clubName}</b>.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailManagerClub, $firstnameManagerClub, 'Xtrem | Permission activée', $contentMail);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que la permission <b>{$permissionName}</b> a été activée pour votre club <b>{$clubName}</b>.<br/>";
            $contentMailPartner .= "Un mail a été envoyé au manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send(true, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Permission club activée', $contentMailPartner);
        }
    }

    //Mails envoyés aux clubs et partenaires suite action sur partenaire et impactant les clubs
    public function toggleClubs($clubs, $partnerName, $firstnameContactPartner, $emailContactPartner)
    {
        $countClubs = 0;
        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que suite à la désactivation du partenaire <b>{$partnerName}</b>, les clubs suivants ont été désactivés : <br/>";
        $contentMailPartner .= "<ul>";

        forEach($clubs as $club) {
            if($club->isIsActive()) {
                $contentMailClub = "Bonjour {$club->getManager()->getFirstname()},<br/><br/>";
                $contentMailClub .= "Le club <b>{$club->getName()}</b> a été désactivé.<br/>";
                $contentMailClub .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
                $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
                $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send(false, $club->getManager()->getEmail(), $club->getManager()->getFirstname(), 'Xtrem | Accès désactivé', $contentMailClub);
    
                $contentMailPartner .= "<li><b>{$club->getName()}</b></li>";
                $countClubs++;
            }
        }
        
        $contentMailPartner .= "</ul><br/>";
        $contentMailPartner .= "Il est donc, dorénavant, impossible pour les managers de ces clubs de se connecter à notre interface.<br/>";
        $contentMailPartner .= "Un mail leur a été envoyé pour les informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        if ($countClubs > 0) {
            $this->send(false, $emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Clubs désactivés', $contentMailPartner);
        }
    }

    //Mail envoyé aux partenaires quand création et suppression d'une permission et clubs concernés quand suppression
    public function createPermission($firstname, $email, $partnerName, $permissionName, $permissionDescription)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Nous venons de créer la nouvelle permission <b>{$permissionName}</b>, dont voici le descriptif : <br/><br/>";
        $contentMail .= "<small>{$permissionDescription}</small><br/><br/>";
        $contentMail .= "Veuillez nous contacter, si vous souhaitez l'activer sur le partenaire <b>{$partnerName}</b> et l'un de ses clubs.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(true, $email, $firstname, 'Xtrem | Création Permission', $contentMail);
    }

    public function deletePermission($partners, $clubs, $permissionName)
    {
        foreach($partners as $partner) {
            if ($partner->isIsactive()) {
                $contentMailPartner = "Bonjour {$partner->getContact()->getFirstname()},<br/><br/>";
                $contentMailPartner .= "Nous venons de supprimer la permission <b>{$permissionName}</b>.<br/>";
                $contentMailPartner .= "Celle-ci ne sera donc plus disponible pour le partenaire <b>{$partner->getName()}</b> et ses clubs.<br/><br/>";
                $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
                $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send(true, $partner->getContact()->getEmail(), $partner->getContact()->getFirstname(), 'Xtrem | Suppression Permission', $contentMailPartner);
            }
        }
        foreach($clubs as $club) { //Ne concerne que les clubs disposant de cette permission
            if ($club->isIsactive()) {
                $contentMailClub = "Bonjour {$club->getManager()->getFirstname()},<br/><br/>";
                $contentMailClub .= "Nous venons de supprimer la permission <b>{$permissionName}</b>.<br/>";
                $contentMailClub .= "Celle-ci ne sera donc plus disponible pour votre club <b>{$club->getName()}</b>.<br/><br/>";
                $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
                $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send(true, $club->getManager()->getEmail(), $club->getManager()->getFirstname(), 'Xtrem | Suppression Permission', $contentMailClub);
            }
        }
    }

    //Réiniialisation accès pour contact partenaire ou manager club
    public function resetAccess($firstname, $email, $uuid)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Votre accès à l'interface Xtrem a été réinitialisé.<br/>";
        $contentMail .= "Vous pouvez recréer votre mot de passe personnel en cliquant sur le lien suivant: <br/>";
        $contentMail .= "<a href='" . $this->getUrl() . "/{$uuid}/creer-mot-de-passe'>Créer mon mot de passe</a><br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $email, $firstname, 'Xtrem | Réinitialisation Accès', $contentMail);
    }

    //Mot de passe oublié
    public function forgottenPwd($firstname, $email, $uuid)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Suite à votre demande, vous pouvez recréer votre mot de passe personnel en cliquant sur le lien suivant: <br/>";
        $contentMail .= "<a href='" . $this->getUrl() . "/{$uuid}/creer-mot-de-passe'>Créer mon mot de passe</a><br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante:<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send(false, $email, $firstname, 'Xtrem | Recréation de mot de passe', $contentMail);
    }
}