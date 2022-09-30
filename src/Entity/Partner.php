<?php

namespace App\Entity;

use App\Repository\PartnerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PartnerRepository::class)]
class Partner
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['partners:read', 'partner:read', 'partner:edit', 'userPartner:read', 'userClub:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['partners:read', 'partner:read', 'partner:edit', 'partnerPermission:edit', 'userPartner:read', 'userClub:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['partners:read', 'partner:read', 'userPartner:read', 'userClub:read'])]
    private ?string $logo = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['partners:read', 'partner:read', 'userPartner:read', 'userClub:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['partners:read', 'partner:read'])]
    private ?bool $isActive = null;

    #[ORM\OneToOne(inversedBy: 'partner', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['partner:read', 'userClub:read'])]
    private ?User $contact = null;

    #[Groups(['partner:read', 'userPartner:read'])]
    #[ORM\OneToMany(mappedBy: 'partner', targetEntity: Club::class)]
    private Collection $clubs;

    #[Groups(['partner:read'])]
    #[ORM\OneToMany(mappedBy: 'Partner', targetEntity: PartnerPermission::class)]
    private Collection $partnerPermissions;

    public function __construct()
    {
        $this->clubs = new ArrayCollection();
        $this->permissions = new ArrayCollection();
        $this->partnerPermissions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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

    public function getContact(): ?User
    {
        return $this->contact;
    }

    public function setContact(User $contact): self
    {
        $this->contact = $contact;

        return $this;
    }

    /**
     * @return Collection<int, Club>
     */
    public function getClubs(): Collection
    {
        return $this->clubs;
    }

    public function addClub(Club $club): self
    {
        if (!$this->clubs->contains($club)) {
            $this->clubs->add($club);
            $club->setPartner($this);
        }

        return $this;
    }

    public function removeClub(Club $club): self
    {
        if ($this->clubs->removeElement($club)) {
            // set the owning side to null (unless already changed)
            if ($club->getPartner() === $this) {
                $club->setPartner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PartnerPermission>
     */
    public function getPartnerPermissions(): Collection
    {
        return $this->partnerPermissions;
    }

    public function addPartnerPermission(PartnerPermission $partnerPermission): self
    {
        if (!$this->partnerPermissions->contains($partnerPermission)) {
            $this->partnerPermissions->add($partnerPermission);
            $partnerPermission->setPartner($this);
        }

        return $this;
    }

    public function removePartnerPermission(PartnerPermission $partnerPermission): self
    {
        if ($this->partnerPermissions->removeElement($partnerPermission)) {
            // set the owning side to null (unless already changed)
            if ($partnerPermission->getPartner() === $this) {
                $partnerPermission->setPartner(null);
            }
        }

        return $this;
    }
}
