import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBateladaTable1753741635978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'batch',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'batchNumber',
                        type: 'int',
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
                        name: 'deleted_at',
                        type: 'timestamp',

                    }

                ],
            }),
            true,
        );
        await queryRunner.createForeignKey(
            "batch",
            new TableForeignKey({
                name: 'batch_created_by_user_id',
                columnNames: ['createdByUserId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                //onDelete: 'SET NULL',
                //onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('batch', 'batch_created_by_user_id');
        await queryRunner.dropTable('batch');
    }

}
