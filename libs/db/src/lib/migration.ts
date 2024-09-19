import * as process from "node:process"
import { migrate, postgresPoolConfig } from "./db.utils"

migrate(postgresPoolConfig, process.argv[2]).catch((error) => {
  console.error("Failed to migrate")
  console.error(error)
  process.exit(1)
})
