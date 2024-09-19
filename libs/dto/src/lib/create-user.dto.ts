import { z } from "zod"

export interface CreateUserDto {
  firstName: string
  lastName: string
  birthDate: string
  phoneNumber: string
  streetAddress: string
  zipCode: string
  city: string
  country: string
}

export const createUserDtoSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  birthDate: z.string().date().trim(),
  phoneNumber: z.string().min(1).max(50).trim(),
  streetAddress: z.string().min(1).max(50).trim(),
  zipCode: z.string().min(1).max(50).trim(),
  city: z.string().min(1).max(50).trim(),
  country: z.string().min(1).max(50).trim(),
})
