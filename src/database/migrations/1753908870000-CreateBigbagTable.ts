import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBigbagTable1753908870000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'bigbag',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'createdByUserId',
                        type: 'int',
                    },
                    {
                        name: 'batchId',
                        type: 'int',
                    },
                    {
                        name: 'numberOfBatch',
                        type: 'int',
                    },
                    {
                        name: 'question1',
                        type: 'tinyint',
                        isNullable: true,
                    },
                    {
                        name: 'question2',
                        type: 'tinyint',
                        isNullable: true,
                    },
                    {
                        name: 'question3',
                        type: 'tinyint',
                        isNullable: true,
                    },
                    {
                        name: 'question4',
                        type: 'tinyint',
                        isNullable: true,
                    },
                    {
                        name: 'question5',
                        type: 'tinyint',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                    }
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "bigbag",
            new TableForeignKey({
                name: 'bigbag_created_by_user_id',
                columnNames: ['createdByUserId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        );

        await queryRunner.createForeignKey(
            "bigbag",
            new TableForeignKey({
                name: 'bigbag_batch_id',
                columnNames: ['batchId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'batch',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('bigbag', 'bigbag_batch_id');
        await queryRunner.dropForeignKey('bigbag', 'bigbag_created_by_user_id');
        await queryRunner.dropTable('bigbag');
    }

}
