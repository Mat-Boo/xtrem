<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220912090924 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE club (id INT AUTO_INCREMENT NOT NULL, manager_id INT NOT NULL, partner_id INT NOT NULL, name VARCHAR(255) NOT NULL, picture VARCHAR(255) NOT NULL, address LONGTEXT NOT NULL, zip_code VARCHAR(50) NOT NULL, city VARCHAR(50) NOT NULL, is_active TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_B8EE3872783E3463 (manager_id), INDEX IDX_B8EE38729393F8FE (partner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE log (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE partner (id INT AUTO_INCREMENT NOT NULL, contact_id INT NOT NULL, name VARCHAR(255) NOT NULL, logo VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, is_active TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_312B3E16E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE partner_permission (partner_id INT NOT NULL, permission_id INT NOT NULL, INDEX IDX_FAB8914C9393F8FE (partner_id), INDEX IDX_FAB8914CFED90CCA (permission_id), PRIMARY KEY(partner_id, permission_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE permission (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE club ADD CONSTRAINT FK_B8EE3872783E3463 FOREIGN KEY (manager_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE club ADD CONSTRAINT FK_B8EE38729393F8FE FOREIGN KEY (partner_id) REFERENCES partner (id)');
        $this->addSql('ALTER TABLE partner ADD CONSTRAINT FK_312B3E16E7A1254A FOREIGN KEY (contact_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE partner_permission ADD CONSTRAINT FK_FAB8914C9393F8FE FOREIGN KEY (partner_id) REFERENCES partner (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE partner_permission ADD CONSTRAINT FK_FAB8914CFED90CCA FOREIGN KEY (permission_id) REFERENCES permission (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE club DROP FOREIGN KEY FK_B8EE3872783E3463');
        $this->addSql('ALTER TABLE club DROP FOREIGN KEY FK_B8EE38729393F8FE');
        $this->addSql('ALTER TABLE partner DROP FOREIGN KEY FK_312B3E16E7A1254A');
        $this->addSql('ALTER TABLE partner_permission DROP FOREIGN KEY FK_FAB8914C9393F8FE');
        $this->addSql('ALTER TABLE partner_permission DROP FOREIGN KEY FK_FAB8914CFED90CCA');
        $this->addSql('DROP TABLE club');
        $this->addSql('DROP TABLE log');
        $this->addSql('DROP TABLE partner');
        $this->addSql('DROP TABLE partner_permission');
        $this->addSql('DROP TABLE permission');
    }
}
