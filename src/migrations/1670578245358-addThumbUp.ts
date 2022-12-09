import { MigrationInterface, QueryRunner } from "typeorm";

export class addThumbUp1670578245358 implements MigrationInterface {
    name = 'addThumbUp1670578245358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`thumbup\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`blogId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`thumbup\``);
    }

}
