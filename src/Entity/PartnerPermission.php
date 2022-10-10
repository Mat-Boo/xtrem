<?php

namespace App\Entity;

use App\Repository\PartnerPermissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PartnerPermissionRepository::class)]
class PartnerPermission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['partner:read', 'partnerPermission:edit', 'userPartner:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['partner:read','userPartner:read'])]
    private ?bool $isActive = null;

    #[ORM\ManyToOne(inversedBy: 'partnerPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['partnerPermission:edit'])]
    private ?Partner $Partner = null;

    #[ORM\ManyToOne(inversedBy: 'partnerPermissions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['partner:read', 'clubPermission:edit', 'userPartner:read', 'userClub:read', 'userPartner:read'])]
    private ?Permission $Permission = null;

    #[ORM\OneToMany(mappedBy: 'PartnerPermissions', targetEntity: ClubPermission::class)]
    private Collection $clubPermissions;

    public function __construct()
    {
        $this->clubPermissions = new ArrayCollection();
    }

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
            $clubPermission->setPartnerPermissions($this);
        }

        return $this;
    }

    public function removeClubPermission(ClubPermission $clubPermission): self
    {
        if ($this->clubPermissions->removeElement($clubPermission)) {
            // set the owning side to null (unless already changed)
            if ($clubPermission->getPartnerPermissions() === $this) {
                $clubPermission->setPartnerPermissions(null);
            }
        }
        return $this;
    }
}