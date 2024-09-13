/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("technology")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("name", "varchar(50)", (col) => col.notNull())
    .addColumn("url", "varchar(50)", (col) => col.notNull())
    .addColumn("icon", "bytea", (col) => col.notNull())
    .addPrimaryKeyConstraint("pk_technology", ["id"])
    .execute();

  await db.schema
    .createTable("project_technology")
    .addColumn("project_id", "uuid")
    .addColumn("technology_id", "uuid")
    .addPrimaryKeyConstraint("pk_project_technology", ["project_id", "technology_id"])
    .addForeignKeyConstraint("fk_project_technology_project", ["project_id"], "project", ["id"])
    .addForeignKeyConstraint("fk_project_technology_technology", ["technology_id"], "technology", ["id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable("project_technology")
    .execute();

  await db.schema
    .dropTable("technology")
    .execute();
}
