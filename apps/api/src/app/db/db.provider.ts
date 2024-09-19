import { Kysely, PostgresDialect } from "kysely"
import { DB, postgresPoolConfig } from "@pf/db"
import { Pool } from "pg"
import { FactoryProvider } from "@nestjs/common"

export const DB_CONNECTION = "DB_CONNECTION"

export const dbProvider: FactoryProvider = {
  provide: DB_CONNECTION,
  useFactory: (): Kysely<DB> =>
    new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool(postgresPoolConfig),
      }),
    }),
}
