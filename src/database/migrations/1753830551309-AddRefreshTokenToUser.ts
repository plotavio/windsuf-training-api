import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1753830551309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN refresh_token VARCHAR(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN refresh_token`);
    }

}
