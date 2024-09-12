/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  const extensionQuery =
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.compile(db);
  await db.executeQuery(extensionQuery);
}

export async function down(db: Kysely<any>): Promise<void> {
  const extensionQuery = sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.compile(db);
  await db.executeQuery(extensionQuery);
}
