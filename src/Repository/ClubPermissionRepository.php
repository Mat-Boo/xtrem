<?php

namespace App\Repository;

use App\Entity\ClubPermission;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ClubPermission>
 *
 * @method ClubPermission|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClubPermission|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClubPermission[]    findAll()
 * @method ClubPermission[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClubPermissionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClubPermission::class);
    }

    public function add(ClubPermission $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ClubPermission $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByClub($idClub): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.Club = :idClub')
            ->setParameter('idClub', $idClub)
            ->getQuery()
            ->getResult()
        ;
    }

    // Requête pour trouver les relations club-permission en fonction de l'id du partenaire et de l'id de la permission
    Public function findByPartnerPermission($idPartnerPermission): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.PartnerPermissions = :idPartnerPermission')
            ->setParameter('idPartnerPermission', $idPartnerPermission)
            ->getQuery()
            ->getResult()
        ;
    }

    // Requête pour trouver les relations club-permission en fonction de l'id du club et de l'id de la ralation partenaire-permission
    Public function findByClubAndPartnerPermission($idClub, $idPartnerPermission): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.Club = :idClub')
            ->setParameter('idClub', $idClub)
            ->andWhere('p.PartnerPermissions = :idPartnerPermission')
            ->setParameter('idPartnerPermission', $idPartnerPermission)
            ->getQuery()
            ->getResult()
        ;
    }

//    /**
//     * @return ClubPermission[] Returns an array of ClubPermission objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ClubPermission
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
