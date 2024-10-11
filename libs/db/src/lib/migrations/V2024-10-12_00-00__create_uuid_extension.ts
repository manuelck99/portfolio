/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.executeQuery(
    sql`create extension if not exists "uuid-ossp"`.compile(db),
  )
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.executeQuery(sql`drop extension if exists "uuid-ossp"`.compile(db))
}
