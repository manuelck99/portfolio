/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("project_type")
    .asEnum(["WORK", "UNIVERSITY", "HOBBY"])
    .execute()

  await db.schema
    .createTable("project")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("name", "varchar(50)", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("type", sql`project_type`, (col) => col.notNull())
    .addColumn("user_id", "uuid")
    .addPrimaryKeyConstraint("pk_project", ["id"])
    .addForeignKeyConstraint("fk_project_user", ["user_id"], "user", ["id"], (cb) => cb.onDelete("cascade"))
    .execute()

  await db.schema
    .createTable("project_image")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("name", "varchar(50)", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("data", "bytea", (col) => col.notNull())
    .addColumn("type", "varchar(50)", (col) => col.notNull())
    .addColumn("project_id", "uuid")
    .addPrimaryKeyConstraint("pk_project_image", ["id"])
    .addForeignKeyConstraint(
      "fk_project_image_project",
      ["project_id"],
      "project",
      ["id"],
      (cb) => cb.onDelete("cascade")
    )
    .execute()

  await db.schema
    .createTable("project_feature")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("project_id", "uuid")
    .addPrimaryKeyConstraint("pk_project_feature", ["id"])
    .addForeignKeyConstraint(
      "fk_project_feature_project",
      ["project_id"],
      "project",
      ["id"],
      (cb) => cb.onDelete("cascade")
    )
    .execute()

  await db.schema
    .createTable("project_responsibility")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("project_id", "uuid")
    .addPrimaryKeyConstraint("pk_project_responsibility", ["id"])
    .addForeignKeyConstraint(
      "fk_project_responsibility_project",
      ["project_id"],
      "project",
      ["id"],
      (cb) => cb.onDelete("cascade")
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("project_responsibility").execute()

  await db.schema.dropTable("project_feature").execute()

  await db.schema.dropTable("project_image").execute()

  await db.schema.dropTable("project").execute()

  await db.schema.dropType("project_type").ifExists().execute()
}
