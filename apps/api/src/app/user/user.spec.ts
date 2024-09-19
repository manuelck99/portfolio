import {
  createKyselyDb,
  DB,
  destroyKyselyDb,
  migratePostgresContainer,
  startPostgresContainer,
  stopPostgresContainer,
} from "@pf/db"
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { Kysely } from "kysely"

describe("User", () => {
  let container: StartedPostgreSqlContainer
  let db: Kysely<DB>
  beforeEach(async () => {
    container = await startPostgresContainer()
    await migratePostgresContainer(container)
    db = createKyselyDb(container)
  })
  afterEach(async () => {
    await destroyKyselyDb(db)
    await stopPostgresContainer(container)
  })
  test("1 + 1 = 2", () => {
    expect(1 + 1).toStrictEqual(2)
  })
})
