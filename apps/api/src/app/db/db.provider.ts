import { Kysely, PostgresDialect } from "kysely"
import { DB, postgresPoolConfig } from "@pf/db"
import { Pool } from "pg"
import * as process from "node:process"
import { FactoryProvider } from "@nestjs/common"

export const DB_CONNECTION = "DB_CONNECTION"

export const dbProvider: FactoryProvider = {
  provide: DB_CONNECTION,
  useFactory: (): Kysely<DB> =>
    new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: process.env.DB_HOST ?? postgresPoolConfig.host,
          port: Number(process.env.DB_PORT) ?? postgresPoolConfig.port,
          database: process.env.DB_NAME ?? postgresPoolConfig.database,
          user: process.env.DB_USER ?? postgresPoolConfig.user,
          password: process.env.DB_PASSWORD ?? postgresPoolConfig.password,
        }),
      }),
    }),
}
