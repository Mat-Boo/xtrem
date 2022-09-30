<?php

namespace App\Entity;

use App\Repository\ClubPermissionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClubPermissionRepository::class)]
class ClubPermission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['club:read', 'partner:read', 'clubPermission:edit', 'userPartner:read', 'userClub:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['club:read', 'partner:read', 'clubPermission:edit', 'userPartner:read', 'userClub:read'])]
    private ?bool $isActive = null;

    #[ORM\ManyToOne(inversedBy: 'clubPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['club:read', 'partner:read', 'clubPermission:edit', 'userPartner:read', 'userClub:read'])]
    private ?PartnerPermission $PartnerPermissions = null;

    #[ORM\ManyToOne(inversedBy: 'clubPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['clubPermission:edit'])]
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
