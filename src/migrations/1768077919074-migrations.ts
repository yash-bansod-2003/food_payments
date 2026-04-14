import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1768077919074 implements MigrationInterface {
    name = 'Migrations1768077919074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "paymentStatus" text NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
    }

}
