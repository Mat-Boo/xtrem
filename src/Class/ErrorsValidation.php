<?php

namespace App\Class;

class ErrorsValidation
{
    private $formData;

    public function __construct(array $formData)
    {
        $this->formData = $formData;
    }

    public function formItemControl()
    {
        $errors = [];
        foreach ($this->formData as $keyItem => $valueItem) {
            switch ($keyItem) {
                case 'firstname':
                    if ($valueItem === '') {
                        $errors['firstname'] = 'Le prénom est obligatoire';
                    } else if (!preg_match('/^[A-Za-z\é\è\ê\-]+$/', $valueItem)) {
                        $errors['firstname'] = 'Le prénom ne doit pas comporter de caractères spéciaux';
                    } else if (strlen($valueItem) < 3) {
                        $errors['firstname'] = 'Le prénom doit comporter au minimum 3 caractères';
                    } else if (strlen($valueItem) > 50) {
                        $errors['firstname'] = 'Le prénom doit comporter au maximum 50 caractères';
                    }
                    break;
                case 'lastname':
                    if ($valueItem === '') {
                        $errors['lastname'] = 'Le nom est obligatoire';
                    } else if (!preg_match('/^[A-Za-z\é\è\ê\-]+$/', $valueItem)) {
                        $errors['lastname'] = 'Le nom ne doit pas comporter de caractères spéciaux';
                    } else if (strlen($valueItem) < 3) {
                        $errors['lastname'] = 'Le nom doit comporter au minimum 3 caractères';
                    } else if (strlen($valueItem) > 50) {
                        $errors['lastname'] = 'Le nom doit comporter au maximum 50 caractères';
                    }
                    break;
                case 'phone':
                    if ($valueItem === '') {
                        $errors['phone'] = 'Le téléphone est obligatoire';
                    } else if (!preg_match('/^(0|0033||\+33)[1-9]([-. ]?[0-9]{2}){4}$/', $valueItem)) {
                        $errors['phone'] = 'Le téléphone doit respecter le format de téléphone français';
                    } else if (strlen($valueItem) < 10) {
                        $errors['phone'] = 'Le téléphone doit comporter au minimum 10 caractères';
                    } else if (strlen($valueItem) > 16) {
                        $errors['phone'] = 'Le téléphone doit comporter au maximum 16 caractères';
                    }
                    break;
                case 'email':
                    if ($valueItem === '') {
                        $errors['email'] = 'L\'email est obligatoire';
                    } else  if (!preg_match('/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+.[a-zA-Z]{2,4}/im', $valueItem)) {
                        $errors['email'] = 'L\'email doit respecter le format d\'un email (ex: john.doe@exemple.com)';
                    } else if (strlen($valueItem) < 6) {
                        $errors['email'] = 'L\'email doit comporter au minimum 6 caractères';
                    } else if (strlen($valueItem) > 255) {
                        $errors['email'] = 'L\'email doit comporter au maximum 255 caractères';
                    }
                    break;
                case 'actualPassword':
                    if ($valueItem === '') {
                        $errors['actualPassword'] = 'Le mot de passe actuel est obligatoire';
                    }
                    break;
                case 'password':
                    if ($valueItem === '') {
                        $errors['password'] = 'Le mot de passe est obligatoire';
                    } else if (!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{0,999})$/', $valueItem)) {
                        $errors['password'] = 'Le mot de passe doit contenir au moins 1 chiffre, 1 lettre minuscule, 
                        1 lettre majuscule, 1 caractère spécial et ne doit contenir aucun espace';
                    } else if (strlen($valueItem) < 8) {
                        $errors['password'] = 'Le mot de passe doit comporter au minimum 8 caractères';
                    } else if (strlen($valueItem) > 20) {
                        $errors['password'] = 'Le mot de passe doit comporter au maximum 20 caractères';
                    }
                    break;
                case 'passwordConfirm':
                    if ($valueItem === '') {
                        $errors['passwordConfirm'] = 'La confirmation du mot de passe est obligatoire';
                    } else if ($this->formData['password'] !== $valueItem) {
                        $errors['passwordConfirm'] = 'Les mots de passe ne correspondent pas';
                    }
                    break;
                case 'name':
                    if ($valueItem === '') {
                        $errors['name'] = 'Le nom est obligatoire';
                    } else if (strlen($valueItem) < 3) {
                        $errors['name'] = 'Le nom doit comporter au minimum 3 caractères';
                    } else if (strlen($valueItem) > 50) {
                        $errors['name'] = 'Le nom doit comporter au maximum 50 caractères';
                    }
                    break;
                case 'logoFile':
                    if ($valueItem === null) {
                        $errors['logo'] = 'Le logo est obligatoire';
                    } else {
                        $ext = pathinfo($this->formData['logoFileName'], PATHINFO_EXTENSION);
                        if (!in_array($ext, ['png', 'jpg', 'PNG', 'JPG'])) {
                            $errors['logo'] = 'Seuls les fichiers PNG et JPG sont autorisés';
                        } else if (filesize($this->formData['logoFile']) > 1048576) {
                            $errors['logo'] = 'Le logo ne doit pas exéceder 1Mo';
                        }
                    }
                    break;
                case 'description':
                    if ($valueItem === '') {
                        $errors['description'] = 'La description est obligatoire';
                    } else if (strlen($valueItem) < 3) {
                        $errors['description'] = 'La description doit comporter au minimum 3 caractères';
                    }
                    break;
                case 'address':
                    if ($valueItem === '') {
                        $errors['address'] = 'L\'adresse est obligatoire';
                    } else if (strlen($valueItem) < 3) {
                        $errors['address'] = 'L\'adresse doit comporter au minimum 3 caractères';
                    }
                    break;
                case 'zipcode':
                    if ($valueItem === '') {
                        $errors['zipcode'] = 'Le code postal est obligatoire';
                    } else if (strlen($valueItem) !== 5 || !(int)$valueItem) {
                        $errors['zipcode'] = 'Le code postal doit comporter 5 chiffres';
                    }
                    break;
                case 'city':
                    if ($valueItem === '') {
                        $errors['city'] = 'La ville est obligatoire';
                    } else if (!preg_match('/^[A-Za-z\é\è\ê\-\ ]+$/', $valueItem)) {
                        $errors['city'] = 'La ville ne doit pas comporter de caractères spéciaux';
                    }
                    break;
            }
        }

        return $errors;
    }
}
