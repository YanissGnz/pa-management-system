import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least  characters long"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type TRegisterSchema = z.infer<typeof registerSchema>;