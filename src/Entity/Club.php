<?php

namespace App\Entity;

use App\Repository\ClubRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClubRepository::class)]
class Club
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['club:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['club:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['club:read'])]
    private ?string $picture = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['club:read'])]
    private ?string $address = null;

    #[ORM\Column(length: 50)]
    #[Groups(['club:read'])]
    private ?string $zip_code = null;

    #[ORM\Column(length: 50)]
    #[Groups(['club:read'])]
    private ?string $city = null;

    #[ORM\Column]
    #[Groups(['club:read'])]
    private ?bool $isActive = null;

    #[ORM\OneToOne(inversedBy: 'club', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['club:read'])]
    private ?User $manager = null;

    #[ORM\ManyToOne(inversedBy: 'clubs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['club:read'])]
    private ?Partner $partner = null;

    #[ORM\OneToMany(mappedBy: 'Club', targetEntity: ClubPermission::class)]
    #[Groups(['club:read'])]
    private Collection $clubPermissions;

    public function __construct()
    {
        $this->clubPermissions = new ArrayCollection();
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

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(string $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zip_code;
    }

    public function setZipCode(string $zip_code): self
    {
        $this->zip_code = $zip_code;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

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

    public function getManager(): ?User
    {
        return $this->manager;
    }

    public function setManager(User $manager): self
    {
        $this->manager = $manager;

        return $this;
    }

    public function getPartner(): ?Partner
    {
        return $this->partner;
    }

    public function setPartner(?Partner $partner): self
    {
        $this->partner = $partner;

        return $this;
    }

    /**
     * @return Collection<int, ClubPermission>
     */
    public function getClubPermissions(): Collection
    {
        return $this->clubPermissions;
    }

    public function addClubPermission(ClubPermission $clubPermission): self
    {
        if (!$this->clubPermissions->contains($clubPermission)) {
            $this->clubPermissions->add($clubPermission);
            $clubPermission->setClub($this);
        }

        return $this;
    }

    public function removeClubPermission(ClubPermission $clubPermission): self
    {
        if ($this->clubPermissions->removeElement($clubPermission)) {
            // set the owning side to null (unless already changed)
            if ($clubPermission->getClub() === $this) {
                $clubPermission->setClub(null);
            }
        }

        return $this;
    }
}
