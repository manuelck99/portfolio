import { Insertable, Selectable, Updateable } from "kysely"
import {
  Project,
  ProjectFeature,
  ProjectImage,
  ProjectResponsibility,
  Technology,
  User,
} from "./db-schema.types"

export type SelectUser = Selectable<User>
export type InsertUser = Insertable<User>
export type UpdateUser = Updateable<User>

export type SelectProject = Selectable<Project>
export type InsertProject = Insertable<Project>
export type UpdateProject = Updateable<Project>

export type SelectProjectResponsibility = Selectable<ProjectResponsibility>
export type InsertProjectResponsibility = Insertable<ProjectResponsibility>
export type UpdateProjectResponsibility = Updateable<ProjectResponsibility>

export type SelectProjectImage = Selectable<ProjectImage>
export type InsertProjectImage = Insertable<ProjectImage>
export type UpdateProjectImage = Updateable<ProjectImage>

export type SelectProjectFeature = Selectable<ProjectFeature>
export type InsertProjectFeature = Insertable<ProjectFeature>
export type UpdateProjectFeature = Updateable<ProjectFeature>

export type SelectTechnology = Selectable<Technology>
export type InsertTechnology = Insertable<Technology>
export type UpdateTechnology = Updateable<Technology>
