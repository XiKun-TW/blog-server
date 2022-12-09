import { MigrationInterface, QueryRunner } from "typeorm";

export class updateBlogDescLength1670574376223 implements MigrationInterface {
    name = 'updateBlogDescLength1670574376223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`description\` varchar(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`description\` varchar(255) NOT NULL`);
    }

}
