<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220912094406 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE partner_permission (id INT AUTO_INCREMENT NOT NULL, partner_id INT NOT NULL, permission_id INT NOT NULL, is_active TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_FAB8914C9393F8FE (partner_id), UNIQUE INDEX UNIQ_FAB8914CFED90CCA (permission_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE partner_permission ADD CONSTRAINT FK_FAB8914C9393F8FE FOREIGN KEY (partner_id) REFERENCES partner (id)');
        $this->addSql('ALTER TABLE partner_permission ADD CONSTRAINT FK_FAB8914CFED90CCA FOREIGN KEY (permission_id) REFERENCES permission (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE partner_permission DROP FOREIGN KEY FK_FAB8914C9393F8FE');
        $this->addSql('ALTER TABLE partner_permission DROP FOREIGN KEY FK_FAB8914CFED90CCA');
        $this->addSql('DROP TABLE partner_permission');
    }
}
