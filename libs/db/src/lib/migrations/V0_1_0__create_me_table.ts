/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("me")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("first_name", "varchar(20)", (col) => col.notNull())
    .addColumn("last_name", "varchar(20)", (col) => col.notNull())
    .addPrimaryKeyConstraint("pk", ["id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("me").execute();
}
