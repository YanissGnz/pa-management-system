import { z } from "zod"

export const teacherSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  username: z.string().min(2, "Username must be at least 2 characters long").optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional().nullable(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .optional()
    .nullable(),
  address: z.string().min(2, "Address must be at least 2 characters long").optional().nullable(),
})

export type TTeacherSchema = z.infer<typeof teacherSchema>
