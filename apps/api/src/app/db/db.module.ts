import { Inject, Module, OnModuleDestroy } from "@nestjs/common"
import { DB_CONNECTION, dbProvider } from "./db.provider"
import { Kysely } from "kysely"
import { DB } from "@pf/db"

@Module({
  providers: [dbProvider],
  exports: [DB_CONNECTION],
})
export class DbModule implements OnModuleDestroy {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) {}

  async onModuleDestroy(): Promise<void> {
    await this.db.destroy()
  }
}
