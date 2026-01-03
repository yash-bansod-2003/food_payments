import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767470050414 implements MigrationInterface {
    name = 'Migrations1767470050414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" text NOT NULL, "name" text NOT NULL, "priceConfigurations" jsonb NOT NULL, "restaurantId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
