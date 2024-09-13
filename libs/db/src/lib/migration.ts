import { Pool } from "pg";
import {
  FileMigrationProvider,
  Kysely,
  MigrationInfo,
  MigrationResultSet,
  Migrator,
  NO_MIGRATIONS,
  PostgresDialect,
} from "kysely";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import { postgresPoolConfig } from "./postgres-pool.config";

type MigrationDepth = "newest" | "oldest" | "none" | string;

async function migrate(migrationDepth?: MigrationDepth): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool(postgresPoolConfig),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const migrations = await migrator.getMigrations();

  let migrationResults: MigrationResultSet;
  if (migrationDepth === "newest") {
    migrationResults = await migrator.migrateToLatest();
  } else if (migrationDepth === "oldest") {
    migrationResults = await migrator.migrateTo(migrations[0].name);
  } else if (migrationDepth === "none") {
    migrationResults = await migrator.migrateTo(NO_MIGRATIONS);
  } else {
    const migrationSteps = getMigrationsSteps(migrationDepth);
    if (migrationSteps === Infinity) {
      throw new Error(`${migrationDepth} not an argument`);
    }

    let index = findIndexOfLastExecutedMigration(migrations);
    index = index + migrationSteps;
    if (index < 0) {
      migrationResults = await migrator.migrateTo(NO_MIGRATIONS);
    } else if (index >= migrations.length) {
      migrationResults = await migrator.migrateToLatest();
    } else {
      migrationResults = await migrator.migrateTo(migrations[index].name);
    }
  }

  migrationResults.results?.forEach((result) => {
    if (result.status === "Success") {
      console.log(
        `Migration ${result.migrationName} was executed successfully`,
      );
    } else if (result.status === "Error") {
      console.error(`Migration ${result.migrationName} failed to execute`);
    } else {
      console.log(`Migration ${result.migrationName} was skipped`);
    }
  });

  if (migrationResults.error) {
    throw migrationResults.error;
  }

  await db.destroy();
}

function getMigrationsSteps(migrationDepth?: MigrationDepth): number {
  if (migrationDepth === undefined) {
    return 1;
  } else if (!Number.isNaN(migrationDepth)) {
    return Math.trunc(Number(migrationDepth));
  } else {
    return Infinity;
  }
}

function findIndexOfLastExecutedMigration(
  migrations: readonly MigrationInfo[],
): number {
  let index = -1;
  for (let i = 0; i < migrations.length; i++) {
    if (migrations[i].executedAt === undefined) {
      break;
    }
    index = i;
  }
  return index;
}

migrate(process.argv[2]).catch((error) => {
  console.error("Failed to migrate");
  console.error(error);
  process.exit(1);
});
