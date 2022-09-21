<?php

namespace App\Entity;

use App\Repository\PermissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PermissionRepository::class)]
class Permission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['permission:read', 'partner:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['permission:read', 'partner:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['permission:read', 'partner:read'])]
    private ?string $description = null;

    #[ORM\OneToMany(mappedBy: 'Permission', targetEntity: PartnerPermission::class)]
    private Collection $partnerPermissions;

    public function __construct()
    {
        $this->partners = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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
            $partnerPermission->setPermission($this);
        }

        return $this;
    }

    public function removePartnerPermission(PartnerPermission $partnerPermission): self
    {
        if ($this->partnerPermissions->removeElement($partnerPermission)) {
            // set the owning side to null (unless already changed)
            if ($partnerPermission->getPermission() === $this) {
                $partnerPermission->setPermission(null);
            }
        }

        return $this;
    }
}
