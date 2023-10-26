import { z } from "zod"
import { TClassSchema } from "./Class"

export const partnerSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  age: z.number().optional(),
  whatsappNumber: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
  level: z.enum(["LN", "L1", "L2", "L3", "L4"]).optional(),
})

export const kidSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  age: z.number().optional(),
  level: z.enum(["LN", "L1", "L2", "L3", "L4"]).optional(),
  schoolType: z.enum(["preschool", "primary", "middle"]).optional(),
  schoolYear: z.string().min(2, "School year must be at least 2 characters long").optional(),
  sex: z.enum(["male", "female"]),
})

export const studentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long"),
  address: z.string().optional(),
  email: z.string().email("Invalid email address").nullable().optional(),
  age: z.number().optional(),
  type: z.enum(["individual", "family", "special"]),
  ageCategory: z.enum(["kid", "adult"]),
  schoolType: z.enum(["preschool", "primary", "middle"]).optional(),
  level: z.enum(["LN", "L1", "L2", "L3", "L4", "unknown"]),
  whatsappNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .optional()
    .nullable(),
  parentName: z.string().min(2, "Name must be at least 2 characters long").optional().nullable(),
  parentNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .optional()
    .nullable(),
  parentEmail: z.string().email("Invalid email address").optional().nullable(),
  parentOccupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters long")
    .optional()
    .nullable(),
  schoolYear: z
    .string()
    .min(2, "School year must be at least 2 characters long")
    .optional()
    .nullable(),
  registrationDate: z.date().optional(),
  registrationStatus: z.enum(["registered", "pre-registered"]).optional().nullable(),
  expectedClasses: z.array(z.string()).max(2).optional(),
  Partner: partnerSchema.optional().nullable(),
  Kids: z.array(kidSchema).optional().nullable(),
  paymentStatus: z.enum(["completed", "not paid", "incomplete"]).optional().nullable(),
  sex: z.enum(["male", "female"]),
  note: z.string().optional().nullable(),
})

export type TStudentSchema = z.infer<typeof studentSchema> & {
  id: string
  code: string
  classId?: string
  classes?: TClassSchema[]
}
export type TPartnerSchema = z.infer<typeof partnerSchema>
export type TKidSchema = z.infer<typeof kidSchema>
