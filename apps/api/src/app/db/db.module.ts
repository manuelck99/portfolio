import { Inject, Module, OnModuleDestroy } from "@nestjs/common"
import { DB_CONNECTION, dbConnectionProvider } from "./db-connection.provider"
import { Kysely } from "kysely"
import { DB } from "@pf/db"
import { dbConfigProvider } from "./db-config.provider"

@Module({
  providers: [dbConfigProvider, dbConnectionProvider],
  exports: [DB_CONNECTION],
})
export class DbModule implements OnModuleDestroy {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) {}

  async onModuleDestroy(): Promise<void> {
    await this.db.destroy()
  }
}
