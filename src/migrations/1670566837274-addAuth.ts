import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAuth1670566837274 implements MigrationInterface {
  name = 'addAuth1670566837274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`auth\``);
  }
}
