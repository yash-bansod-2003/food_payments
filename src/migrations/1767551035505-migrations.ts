import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767551035505 implements MigrationInterface {
  name = "Migrations1767551035505";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "toppings" ("id" text NOT NULL, "name" text NOT NULL, "price" integer NOT NULL, "restaurantId" integer NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a1c9185d307454dfadc29f3019" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "toppings"`);
  }
}
