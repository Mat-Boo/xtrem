<?php

namespace App\Entity;

use App\Repository\PartnerPermissionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PartnerPermissionRepository::class)]
class PartnerPermission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['partner:read', 'partnerPermission:edit'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['partner:read'])]
    private ?bool $isActive = null;

    #[ORM\ManyToOne(inversedBy: 'partnerPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['partnerPermission:edit'])]
    private ?Partner $Partner = null;

    #[ORM\ManyToOne(inversedBy: 'partnerPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['partner:read'])]
    private ?Permission $Permission = null;

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

    public function getPartner(): ?Partner
    {
        return $this->Partner;
    }

    public function setPartner(?Partner $Partner): self
    {
        $this->Partner = $Partner;

        return $this;
    }

    public function getPermission(): ?Permission
    {
        return $this->Permission;
    }

    public function setPermission(?Permission $Permission): self
    {
        $this->Permission = $Permission;

        return $this;
    }
}
