import { Insertable, Selectable, Updateable } from "kysely";
import { Me } from "./db-schema.types";

export type SelectMe = Selectable<Me>;
export type InsertMe = Insertable<Me>;
export type UpdateMe = Updateable<Me>;
