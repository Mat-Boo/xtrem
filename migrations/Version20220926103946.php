<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220926103946 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE club_permission (id INT AUTO_INCREMENT NOT NULL, partner_permissions_id INT NOT NULL, club_id INT NOT NULL, is_active TINYINT(1) NOT NULL, INDEX IDX_A98FDC479DA9C6BC (partner_permissions_id), INDEX IDX_A98FDC4761190A32 (club_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE club_permission ADD CONSTRAINT FK_A98FDC479DA9C6BC FOREIGN KEY (partner_permissions_id) REFERENCES partner_permission (id)');
        $this->addSql('ALTER TABLE club_permission ADD CONSTRAINT FK_A98FDC4761190A32 FOREIGN KEY (club_id) REFERENCES club (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE club_permission DROP FOREIGN KEY FK_A98FDC479DA9C6BC');
        $this->addSql('ALTER TABLE club_permission DROP FOREIGN KEY FK_A98FDC4761190A32');
        $this->addSql('DROP TABLE club_permission');
    }
}
