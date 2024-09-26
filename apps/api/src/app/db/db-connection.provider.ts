import { Kysely, PostgresDialect } from "kysely"
import { DB } from "@pf/db"
import { Pool, PoolConfig } from "pg"
import { FactoryProvider } from "@nestjs/common"
import { DB_CONFIG } from "./db-config.provider"

export const DB_CONNECTION = "DB_CONNECTION"

export const dbConnectionProvider: FactoryProvider = {
  provide: DB_CONNECTION,
  useFactory: (poolConfig: PoolConfig): Kysely<DB> =>
    new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool(poolConfig),
      }),
    }),
  inject: [DB_CONFIG],
}
