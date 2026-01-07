import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1767812227980 implements MigrationInterface {
  name = "Migrations1767812227980";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "idempotency" ("id" SERIAL NOT NULL, "key" text NOT NULL, "response" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7db4ecce9e7d787fe8fb72ad97f" UNIQUE ("key"), CONSTRAINT "PK_cec40256e4ef03c10eef53aa729" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7db4ecce9e7d787fe8fb72ad97" ON "idempotency" ("key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7db4ecce9e7d787fe8fb72ad97"`,
    );
    await queryRunner.query(`DROP TABLE "idempotency"`);
  }
}
