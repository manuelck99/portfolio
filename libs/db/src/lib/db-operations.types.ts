import { Insertable, Selectable, Updateable } from "kysely";
import { User } from "./db-schema.types";

export type SelectUser = Selectable<User>;
export type InsertUser = Insertable<User>;
export type UpdateUser = Updateable<User>;
