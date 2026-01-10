import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1768066323889 implements MigrationInterface {
  name = "Migrations1768066323889";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "payment_gateway_customer_id" text NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers" DROP COLUMN "payment_gateway_customer_id"`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "is_active"`);
  }
}
