/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.defaultTo(sql`uuid_generate_v4()`))
    .addColumn("first_name", "varchar(50)", (col) => col.notNull())
    .addColumn("last_name", "varchar(50)", (col) => col.notNull())
    .addColumn("birth_date", "date", (col) => col.notNull())
    .addColumn("phone_number", "varchar(50)", (col) => col.notNull())
    .addColumn("city", "varchar(50)", (col) => col.notNull())
    .addColumn("country", "varchar(50)", (col) => col.notNull())
    .addColumn("street_address", "varchar(50)", (col) => col.notNull())
    .addColumn("zip_code", "varchar(50)", (col) => col.notNull())
    .addPrimaryKeyConstraint("pk_user", ["id"])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").execute()
}
