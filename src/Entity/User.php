<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['partner:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'partner:read', 'club:read', 'userPartner:read', 'userClub:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column(nullable: true)]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'partner:read', 'club:read', 'userPartner:read', 'userClub:read'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'partner:read', 'club:read', 'userPartner:read', 'userClub:read'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 15, nullable: true)]
    #[Groups(['user:read', 'partner:read', 'club:read', 'userPartner:read', 'userClub:read'])]
    private ?string $phone = null;

    #[ORM\OneToOne(mappedBy: 'contact', cascade: ['persist', 'remove'])]
    #[Groups(['userPartner:read'])]
    private ?Partner $partner = null;

    #[ORM\OneToOne(mappedBy: 'manager', cascade: ['persist', 'remove'])]
    #[Groups(['userClub:read'])]
    private ?Club $club = null;

    #[ORM\Column]
    private ?bool $isActive = null;

    #[ORM\Column]
    private ?bool $hasCreatedPwd = null;

    #[ORM\Column(type: Types::GUID)]
    private ?string $uuid = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getPartner(): ?Partner
    {
        return $this->partner;
    }

    public function setPartner(Partner $partner): self
    {
        // set the owning side of the relation if necessary
        if ($partner->getContact() !== $this) {
            $partner->setContact($this);
        }

        $this->partner = $partner;

        return $this;
    }

    public function getClub(): ?Club
    {
        return $this->club;
    }

    public function setClub(Club $club): self
    {
        // set the owning side of the relation if necessary
        if ($club->getManager() !== $this) {
            $club->setManager($this);
        }

        $this->club = $club;

        return $this;
    }

    public function isIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function isHasCreatedPwd(): ?bool
    {
        return $this->hasCreatedPwd;
    }

    public function setHasCreatedPwd(bool $hasCreatedPwd): self
    {
        $this->hasCreatedPwd = $hasCreatedPwd;

        return $this;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): self
    {
        $this->uuid = $uuid;

        return $this;
    }
}
