import { z } from "zod"

const levelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Level name must be at least 2 characters long"),
  description: z.string().optional(),
  duration: z.number().positive(),
  price: z.number().positive(),
})

export const programSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Program name must be at least 2 characters long"),
  description: z.string().optional(),
  levels: z.array(levelSchema).min(1, "Program must have at least 1 level"),
})

export type TLevelSchema = z.infer<typeof levelSchema>
export type TProgramSchema = z.infer<typeof programSchema>
