import { z } from "zod"

export const levelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Level name must be at least 2 characters long"),
  description: z.string().optional(),
  duration: z.number().positive("Duration must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
})

export type TLevelSchema = z.infer<typeof levelSchema>
