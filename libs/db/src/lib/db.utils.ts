import { Pool, PoolConfig } from "pg"
import {
  FileMigrationProvider,
  Kysely,
  MigrationInfo,
  MigrationResultSet,
  Migrator,
  NO_MIGRATIONS,
  PostgresDialect,
  sql,
} from "kysely"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as process from "node:process"
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { StoppedTestContainer } from "testcontainers"
import { DB } from "./db-schema.types"

export const postgresPoolConfig: PoolConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 5432,
  database: process.env.DB_NAME ?? "postgres",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
}

const POSTGRES_IMAGE = "postgres:16.4-alpine3.20"

export async function startPostgresContainer(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer(POSTGRES_IMAGE).start()
}

export async function migratePostgresContainer(
  postgresContainer: StartedPostgreSqlContainer,
): Promise<void> {
  await migrate(
    {
      host: postgresContainer.getHost(),
      port: postgresContainer.getPort(),
      database: postgresContainer.getDatabase(),
      user: postgresContainer.getUsername(),
      password: postgresContainer.getPassword(),
    },
    "newest",
    true,
  )
}

export async function stopPostgresContainer(
  postgresContainer: StartedPostgreSqlContainer,
): Promise<StoppedTestContainer> {
  return postgresContainer.stop({ timeout: 10000 })
}

export function createKyselyDb(
  postgresContainer: StartedPostgreSqlContainer,
): Kysely<DB> {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: postgresContainer.getHost(),
        port: postgresContainer.getPort(),
        database: postgresContainer.getDatabase(),
        user: postgresContainer.getUsername(),
        password: postgresContainer.getPassword(),
      }),
    }),
  })
}

export async function destroyKyselyDb(db: Kysely<DB>): Promise<void> {
  await db.destroy()
}

export async function clearKyselyDb(db: Kysely<DB>): Promise<void> {
  await db.executeQuery(
    sql`
      truncate "user",
        project,
        project_image,
        project_feature,
        project_responsibility,
        technology,
        project_technology cascade
    `.compile(db),
  )
}

export type MigrationDepth = "newest" | "oldest" | "none" | string

export async function migrate(
  poolConfig: PoolConfig,
  migrationDepth?: MigrationDepth,
  disableLog = false,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool(poolConfig),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  })

  const migrations = await migrator.getMigrations()

  let migrationResults: MigrationResultSet
  if (migrationDepth === "newest") {
    migrationResults = await migrator.migrateToLatest()
  } else if (migrationDepth === "oldest") {
    migrationResults = await migrator.migrateTo(migrations[0].name)
  } else if (migrationDepth === "none") {
    migrationResults = await migrator.migrateTo(NO_MIGRATIONS)
  } else {
    const migrationSteps = getMigrationsSteps(migrationDepth)
    if (migrationSteps === Infinity) {
      throw new Error(`${migrationDepth} not an argument`)
    }

    let index = findIndexOfLastExecutedMigration(migrations)
    index = index + migrationSteps
    if (index < 0) {
      migrationResults = await migrator.migrateTo(NO_MIGRATIONS)
    } else if (index >= migrations.length) {
      migrationResults = await migrator.migrateToLatest()
    } else {
      migrationResults = await migrator.migrateTo(migrations[index].name)
    }
  }

  if (!disableLog) {
    migrationResults.results?.forEach((result) => {
      if (result.status === "Success") {
        console.log(
          `Migration ${result.migrationName} was executed successfully`,
        )
      } else if (result.status === "Error") {
        console.error(`Migration ${result.migrationName} failed to execute`)
      } else {
        console.log(`Migration ${result.migrationName} was skipped`)
      }
    })
  }

  if (migrationResults.error) {
    throw migrationResults.error
  }

  await db.destroy()
}

function getMigrationsSteps(migrationDepth?: MigrationDepth): number {
  if (migrationDepth === undefined) {
    return 1
  } else if (!Number.isNaN(migrationDepth)) {
    return Math.trunc(Number(migrationDepth))
  } else {
    return Infinity
  }
}

function findIndexOfLastExecutedMigration(
  migrations: readonly MigrationInfo[],
): number {
  let index = -1
  for (let i = 0; i < migrations.length; i++) {
    if (migrations[i].executedAt === undefined) {
      break
    }
    index = i
  }
  return index
}
