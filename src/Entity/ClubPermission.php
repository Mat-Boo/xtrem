<?php

namespace App\Entity;

use App\Repository\ClubPermissionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClubPermissionRepository::class)]
class ClubPermission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $isActive = null;

    #[ORM\ManyToOne(inversedBy: 'clubPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?PartnerPermission $PartnerPermissions = null;

    #[ORM\ManyToOne(inversedBy: 'clubPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Club $Club = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPartnerPermissions(): ?PartnerPermission
    {
        return $this->PartnerPermissions;
    }

    public function setPartnerPermissions(?PartnerPermission $PartnerPermissions): self
    {
        $this->PartnerPermissions = $PartnerPermissions;

        return $this;
    }

    public function getClub(): ?Club
    {
        return $this->Club;
    }

    public function setClub(?Club $Club): self
    {
        $this->Club = $Club;

        return $this;
    }
}
