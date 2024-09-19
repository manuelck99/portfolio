import { Inject, Injectable } from "@nestjs/common"
import { DB_CONNECTION } from "../db/db.provider"
import { DeleteResult, Kysely } from "kysely"
import { DB, InsertUser, SelectUser } from "@pf/db"

@Injectable()
export class UserRepository {
  constructor(@Inject(DB_CONNECTION) private readonly db: Kysely<DB>) {}

  async getUser(id: string): Promise<SelectUser | undefined> {
    return this.db
      .selectFrom("user")
      .where("user.id", "=", id)
      .select([
        "id",
        "first_name",
        "last_name",
        "birth_date",
        "phone_number",
        "street_address",
        "zip_code",
        "city",
        "country",
      ])
      .executeTakeFirst()
  }

  async createUser(insertUser: InsertUser): Promise<SelectUser | undefined> {
    return this.db
      .insertInto("user")
      .values(insertUser)
      .returning([
        "id",
        "first_name",
        "last_name",
        "birth_date",
        "phone_number",
        "street_address",
        "zip_code",
        "city",
        "country",
      ])
      .executeTakeFirst()
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.db
      .deleteFrom("user")
      .where("user.id", "=", id)
      .executeTakeFirst()
  }
}
