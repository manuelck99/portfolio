/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely"

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type ProjectType = "HOBBY" | "UNIVERSITY" | "WORK"

export type Timestamp = ColumnType<Date, Date | string>

export interface Project {
  description: string
  id: Generated<string>
  name: string
  type: ProjectType
  user_id: string | null
}

export interface ProjectFeature {
  description: string
  id: Generated<string>
  project_id: string | null
}

export interface ProjectImage {
  data: Buffer
  description: string
  id: Generated<string>
  name: string
  project_id: string | null
  type: string
}

export interface ProjectResponsibility {
  description: string
  id: Generated<string>
  project_id: string | null
}

export interface ProjectTechnology {
  project_id: string
  technology_id: string
}

export interface Technology {
  icon: Buffer
  id: Generated<string>
  name: string
  url: string
}

export interface User {
  birth_date: Timestamp
  city: string
  country: string
  first_name: string
  id: Generated<string>
  last_name: string
  phone_number: string
  street_address: string
  zip_code: string
}

export interface DB {
  project: Project
  project_feature: ProjectFeature
  project_image: ProjectImage
  project_responsibility: ProjectResponsibility
  project_technology: ProjectTechnology
  technology: Technology
  user: User
}
