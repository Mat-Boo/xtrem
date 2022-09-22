<?php

namespace App\Repository;

use App\Entity\PartnerPermission;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PartnerPermission>
 *
 * @method PartnerPermission|null find($id, $lockMode = null, $lockVersion = null)
 * @method PartnerPermission|null findOneBy(array $criteria, array $orderBy = null)
 * @method PartnerPermission[]    findAll()
 * @method PartnerPermission[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PartnerPermissionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PartnerPermission::class);
    }

    public function add(PartnerPermission $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PartnerPermission $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByPermission($permission): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.Permission = :permission')
            ->setParameter('permission', $permission)
            ->getQuery()
            ->getResult()
        ;
    }

    // Requête pour trouver la relation partenaire-permission en fonction de l'id du partenaire et de l'id de la permission
    Public function findOneByIdPartnerAndIdPermission($idPartner, $idPermission): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.Partner = :idPartner')
            ->setParameter('idPartner', $idPartner)
            ->andWhere('p.Permission = :idPermission')
            ->setParameter('idPermission', $idPermission)
            ->getQuery()
            ->getResult()
        ;
    }
    

//    /**
//     * @return PartnerPermission[] Returns an array of PartnerPermission objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PartnerPermission
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
