import { ProjectType } from "@pf/db"

export interface ProjectDto {
  id: string
  name: string
  description: string
  type: ProjectType
  userId: string | null
}
