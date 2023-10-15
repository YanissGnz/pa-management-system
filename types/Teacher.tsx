import { z } from "zod"

export const teacherSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

export type TTeacherSchema = z.infer<typeof teacherSchema>
