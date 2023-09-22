import { z } from "zod";

export const teacherSchema = z
    .object({
        id: z.string().uuid(),
        firstName: z.string().min(2, "First name must be at least 2 characters long"),
        lastName: z.string().min(2, "Last name must be at least 2 characters long"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
        address: z.string().min(2, "Address must be at least 2 characters long"),
    })


export type TTeacherSchema = z.infer<typeof teacherSchema>;