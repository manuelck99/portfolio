/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  const extensionQuery =
    sql`create extension if not exists "uuid-ossp"`.compile(db);
  await db.executeQuery(extensionQuery);
}

export async function down(db: Kysely<any>): Promise<void> {
  const extensionQuery = sql`drop extension if exists "uuid-ossp"`.compile(db);
  await db.executeQuery(extensionQuery);
}
