import { ValueProvider } from "@nestjs/common"
import { PoolConfig } from "pg"
import { postgresPoolConfig } from "@pf/db"

export const DB_CONFIG = "DB_CONFIG"

export const dbConfigProvider: ValueProvider<PoolConfig> = {
  provide: DB_CONFIG,
  useValue: postgresPoolConfig,
}
