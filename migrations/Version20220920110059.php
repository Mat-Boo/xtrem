<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220920110059 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE partner_permission DROP INDEX UNIQ_FAB8914CFED90CCA, ADD INDEX IDX_FAB8914CFED90CCA (permission_id)');
        $this->addSql('ALTER TABLE partner_permission DROP INDEX UNIQ_FAB8914C9393F8FE, ADD INDEX IDX_FAB8914C9393F8FE (partner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE partner_permission DROP INDEX IDX_FAB8914C9393F8FE, ADD UNIQUE INDEX UNIQ_FAB8914C9393F8FE (partner_id)');
        $this->addSql('ALTER TABLE partner_permission DROP INDEX IDX_FAB8914CFED90CCA, ADD UNIQUE INDEX UNIQ_FAB8914CFED90CCA (permission_id)');
    }
}
