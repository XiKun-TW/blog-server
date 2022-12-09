import { MigrationInterface, QueryRunner } from "typeorm";

export class addBlog1670574229997 implements MigrationInterface {
    name = 'addBlog1670574229997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blog\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`userId\` varchar(255) NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`blog\``);
    }

}
