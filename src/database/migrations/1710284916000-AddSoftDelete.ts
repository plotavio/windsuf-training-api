import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDelete1710284916000 implements MigrationInterface {
    name = 'AddSoftDelete1710284916000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`deleted_at\` timestamp NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`deleted_at\``
        );
    }
}
