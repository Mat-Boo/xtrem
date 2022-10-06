<?php

namespace App\Class;
use Mailjet\Resources;
use Mailjet\Client;

class Mail {

    public function send($to_email, $to_name, $subject, $content)
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
                    'TemplateID' => 4129346,
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

    //Mails concernant les contacts de partenaire
    public function createPartner($firstname, $email, $password)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Votre accès à l'interface Xtrem est opérationnelle.<br/>";
        $contentMail .= "Vous pouvez à présent vous connecter en cliquant sur le bouton ci-dessous avec les identifiants suivants :<br/>";
        $contentMail .= "Email : <b>{$email}</b><br/>";
        $contentMail .= "Mot de passe temporaire : <b>{$password}</b><br/><br/>";
        $contentMail .= "Ce mot de passe est temporaire, vous devrez le modifier dès votre 1ère connexion.<br/>";
        $contentMail .= "Vous retrouverez l'ensemble des informations du partenaire et les permissions mises en place et donc activable ou désactivable sur demande pour vos clubs.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($email, $firstname, 'Xtrem | Accès Interface', $contentMail);
    }

    public function editPartner($partnerName, $description, $firstname, $lastname, $phone, $email)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Les informations du partenaire <b>{$partnerName}</b> ont été mises à jour.<br/>";
        $contentMail .= "Veuillez trouver le récapitualtif de ces informations :<br/>";
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
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($email, $firstname, 'Xtrem | Modification d\'informations', $contentMail);
    }

    public function togglePartner($PartnerState, $partnerName, $firstname, $email)
    {
        if ($PartnerState === "0") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "Le partenaire <b>{$partnerName}</b> a été désactivé.<br/>";
            $contentMail .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($email, $firstname, 'Xtrem | Accès désactivé', $contentMail);
        } else if ($PartnerState === "1") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "Le partenaire <b>{$partnerName}</b> a été activé.<br/>";
            $contentMail .= "Votre accès à notre interface a donc été activé aussi, vous pouvez donc vous connecter avec vos identifiants habituels.<br/><br/>";
            $contentMail .= "Vos clubs restent désactivés, veuillez nous contactez pour leur activation.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($email, $firstname, 'Xtrem | Accès activé', $contentMail);
        }
    }

    public function deletePartner($partnerName, $firstname, $email)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Le partenaire <b>{$partnerName}</b> a été supprimé de notre base de données.<br/>";
        $contentMail .= "Votre accès à notre interface a donc été clôturé.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($email, $firstname, 'Xtrem | Accès clôturé', $contentMail);
    }

    public function resetPasswordPartner($firstname, $email, $password)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Votre mot de passe a été réinitialisé.<br/>";
        $contentMail .= "Vous pouvez à présent vous connecter en cliquant sur le bouton ci-dessous avec les identifiants suivants :<br/>";
        $contentMail .= "Email : <b>{$email}</b><br/>";
        $contentMail .= "Mot de passe temporaire : <b>{$password}</b><br/><br/>";
        $contentMail .= "Ce mot de passe est temporaire, vous devrez le modifier dès votre 1ère connexion.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($email, $firstname, 'Xtrem | Réinitialisation de mot de passe', $contentMail);
    }

    public function togglePartnerPermission($permissionState, $permissionName, $partnerName, $firstname, $email)
    {
        if ($permissionState === "0") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été désactivée pour le partenaire <b>{$partnerName}</b>.<br/>";
            $contentMail .= "L'ensemble de vos clubs n'auront donc plus accès à cette permission.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($email, $firstname, 'Xtrem | Permission désactivée', $contentMail);
        } else if ($permissionState === "1") {
            $contentMail = "Bonjour {$firstname},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été activée pour le partenaire <b>{$partnerName}</b>.<br/>";
            $contentMail .= "Cette permission est dorénavant disponible mais inactive par défaut pour vos clubs.<br/>";
            $contentMail .= "Veuillez nous contactez pour l'activation sur l'un de vos clubs.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($email, $firstname, 'Xtrem | Permission activée', $contentMail);
        }
    }

    //Mails concernant les managers de club et on prévient aussi le partenaire
    public function createClub($firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $passwordManagerClub, $clubName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Votre accès à l'interface Xtrem est opérationnelle.<br/>";
        $contentMailClub .= "Vous pouvez à présent vous connecter en cliquant sur le bouton ci-dessous avec les identifiants suivants :<br/>";
        $contentMailClub .= "Email : <b>{$emailManagerClub}</b><br/>";
        $contentMailClub .= "Mot de passe temporaire : <b>{$passwordManagerClub}</b><br/><br/>";
        $contentMailClub .= "Ce mot de passe est temporaire, vous devrez le modifier dès votre 1ère connexion.<br/>";
        $contentMailClub .= "Vous retrouverez l'ensemble des informations du club et les permissions mises en place et donc activable ou désactivable sur demande de votre partenaire.<br/><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès Interface', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été créé sur notre interface.<br/>";
        $contentMailPartner .= "Il apparaîtra dorénavant parmi vos clubs.<br/>";
        $contentMailPartner .= "Un mail a été envoyé au manager, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b> pour l'en informer et lui donner ses identifiants de connexion.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Création Club', $contentMailPartner);
    }

    public function editClub($firstnameManagerClub, $lastnameManagerClub, $phoneManagerClub, $emailManagerClub, $clubName, $clubAddress, $clubZipcode, $clubCity, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Les informations du club <b>{$clubName}</b> ont été mises à jour.<br/>";
        $contentMailClub .= "Veuillez trouver le récapitualtif de ces informations :<br/>";
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
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Modification Informations', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que les informations de votre club <b>{$clubName}</b> ont été mises à jour.<br/>";
        $contentMailPartner .= "Veuillez trouver le récapitualtif de ces informations :<br/>";
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
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Modification Informations Club', $contentMailPartner);
    }

    public function toggleClub($clubState, $clubName, $firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $firstnameContactPartner, $emailContactPartner)
    {
        if ($clubState === "0") {
            $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMailClub .= "Le club <b>{$clubName}</b> a été désactivé.<br/>";
            $contentMailClub .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
            $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès désactivé', $contentMailClub);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été désactivé.<br/>";
            $contentMailPartner .= "Il est donc, dorénavant, impossible pour le manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, de se connecter à notre interface.<br/>";
            $contentMailPartner .= "Un mail lui a été envoyé pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club désactivé', $contentMailPartner);
        } else if ($clubState === "1") {
            $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMailClub .= "Le club <b>{$clubName}</b> a été activé.<br/>";
            $contentMailClub .= "Votre accès à notre interface a donc été activé aussi, vous pouvez donc vous connecter avec vos identifiants habituels.<br/><br/>";
            $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès activé', $contentMailClub);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été activé.<br/>";
            $contentMailPartner .= "Il est donc, dorénavant, possible pour le manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, de se connecter à notre interface.<br/>";
            $contentMailPartner .= "Un mail lui a été envoyé pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club activé', $contentMailPartner);
        }
    }

    public function deleteClub($firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $clubName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Le club <b>{$clubName}</b> a été supprimé de notre base de données.<br/>";
        $contentMailClub .= "Votre accès à notre interface a donc été clôturé.<br/><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Accès clôturé', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que votre club <b>{$clubName}</b> a été supprimé de notre base de données.<br/>";
        $contentMailPartner .= "Un mail a été envoyé au manager, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b> pour l'en informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Club clôturé', $contentMailPartner);
    }

    public function resetPasswordClub($firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $passwordManagerClub, $clubName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailClub = "Bonjour {$firstnameManagerClub},<br/><br/>";
        $contentMailClub .= "Votre mot de passe a été réinitialisé.<br/>";
        $contentMailClub .= "Vous pouvez à présent vous connecter en cliquant sur le bouton ci-dessous avec les identifiants suivants :<br/>";
        $contentMailClub .= "Email : <b>{$emailManagerClub}</b><br/>";
        $contentMailClub .= "Mot de passe temporaire : <b>{$passwordManagerClub}</b><br/><br/>";
        $contentMailClub .= "Ce mot de passe est temporaire, vous devrez le modifier dès votre 1ère connexion.<br/><br/>";
        $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Réinitialisation de mot de passe', $contentMailClub);

        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que le mot de passe de <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, manager du club <b>{$clubName}</b> a été réinitialisé.<br/>";
        $contentMailPartner .= "Un mail lui a été envoyé pour l'en informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Réinitialisation de mot de passe', $contentMailPartner);
    }

    public function toggleClubPermission($permissionState, $permissionName, $clubName, $firstnameManagerClub, $lastnameManagerClub, $emailManagerClub, $firstnameContactPartner, $emailContactPartner)
    {
        if ($permissionState === "0") {
            $contentMail = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été désactivée pour votre club <b>{$clubName}</b>.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Permission désactivée', $contentMail);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que la permission <b>{$permissionName}</b> a été désactivée pour votre club <b>{$clubName}</b>.<br/>";
            $contentMailPartner .= "Un mail a été envoyé au manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Permission club désactivée', $contentMailPartner);
        } else if ($permissionState === "1") {
            $contentMail = "Bonjour {$firstnameManagerClub},<br/><br/>";
            $contentMail .= "La permission <b>{$permissionName}</b> a été activée pour votre club <b>{$clubName}</b>.<br/><br/>";
            $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailManagerClub, $firstnameManagerClub, 'Xtrem | Permission activée', $contentMail);

            $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
            $contentMailPartner .= "Nous vous informons que la permission <b>{$permissionName}</b> a été activée pour votre club <b>{$clubName}</b>.<br/>";
            $contentMailPartner .= "Un mail a été envoyé au manager de ce club, <b>{$firstnameManagerClub} {$lastnameManagerClub}</b>, pour l'en informer.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Permission club activée', $contentMailPartner);
        }
    }

    //Mails envoyés aux clubs et partenaires suite action sur partenaire et impactant les clubs
    public function toggleClubs($clubs, $partnerName, $firstnameContactPartner, $emailContactPartner)
    {
        $contentMailPartner = "Bonjour {$firstnameContactPartner},<br/><br/>";
        $contentMailPartner .= "Nous vous informons que suite à la désactivation du partenaire <b>{$partnerName}</b>, les clubs suivants ont été désactivés : <br/>";
        $contentMailPartner .= "<ul>";

        forEach($clubs as $club) {
            if($club->isIsActive()) {
                $contentMailClub = "Bonjour {$club->getManager()->getFirstname()},<br/><br/>";
                $contentMailClub .= "Le club <b>{$club->getName()}</b> a été désactivé.<br/>";
                $contentMailClub .= "Votre accès à notre interface a donc été désactivé aussi.<br/><br/>";
                $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
                $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
                $this->send($club->getManager()->getEmail(), $club->getManager()->getFirstname(), 'Xtrem | Accès désactivé', $contentMailClub);
    
                $contentMailPartner .= "<li><b>{$club->getName()}</b></li>";
            }
        }
        
        $contentMailPartner .= "</ul><br/>";
        $contentMailPartner .= "Il est donc, dorénavant, impossible pour les managers de ces clubs de se connecter à notre interface.<br/>";
        $contentMailPartner .= "Un mail leur a été envoyé pour les informer.<br/><br/>";
        $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($emailContactPartner, $firstnameContactPartner, 'Xtrem | Accès Clubs désactivés', $contentMailPartner);
    }

    //Mail envoyé aux partenaires quand création et suppression d'une permission et clubs concernés quand suppression
    public function createPermission($firstname, $email, $partnerName, $permissionName, $permissionDescription)
    {
        $contentMail = "Bonjour {$firstname},<br/><br/>";
        $contentMail .= "Nous venons de créer la nouvelle permission <b>{$permissionName}</b>, dont voici le descriptif : <br/><br/>";
        $contentMail .= "<small>{$permissionDescription}</small><br/><br/>";
        $contentMail .= "Veuillez nous contacter, si vous souhaitez l'activer sur le partenaire <b>{$partnerName}</b> et l'un de ses clubs.<br/><br/>";
        $contentMail .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
        $contentMail .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
        $this->send($email, $firstname, 'Xtrem | Création Permission', $contentMail);
    }

    public function deletePermission($partners, $clubs, $permissionName)
    {
        foreach($partners as $partner) {
            $contentMailPartner = "Bonjour {$partner->getContact()->getFirstname()},<br/><br/>";
            $contentMailPartner .= "Nous venons de supprimer la permission <b>{$permissionName}</b>.<br/>";
            $contentMailPartner .= "Celle-ci ne sera donc plus disponible pour le partenaire <b>{$partner->getName()}</b> et ses clubs.<br/><br/>";
            $contentMailPartner .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailPartner .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($partner->getContact()->getEmail(), $partner->getContact()->getFirstname(), 'Xtrem | Suppression Permission', $contentMailPartner);
        }
        foreach($clubs as $club) {
            $contentMailClub = "Bonjour {$club->getManager()->getFirstname()},<br/><br/>";
            $contentMailClub .= "Nous venons de supprimer la permission <b>{$permissionName}</b>.<br/>";
            $contentMailClub .= "Celle-ci ne sera donc plus disponible pour votre club <b>{$club->getName()}</b>.<br/><br/>";
            $contentMailClub .= "Pour toute réclamation, vous pouvez nous contacter à l'adresse suivante :<br/>";
            $contentMailClub .= "<a href='mailto:contact@xtrem.fr'>contact@xtrem.fr</a><br/>";
            $this->send($club->getManager()->getEmail(), $club->getManager()->getFirstname(), 'Xtrem | Suppression Permission', $contentMailClub);
        }
    }
}