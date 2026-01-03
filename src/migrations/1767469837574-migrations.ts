import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767469837574 implements MigrationInterface {
    name = 'Migrations1767469837574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_e025109230e82925843f2a14c4" ON "coupons" ("code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e025109230e82925843f2a14c4"`);
    }

}
