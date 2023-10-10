import { Student } from "@prisma/client"
import { z } from "zod"

export const classDaysSchema = z.object({
  id: z.string().optional(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  color: z.string().optional(),
})

export const classSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Class title must be at least 2 characters long"),
  description: z.string().optional(),
  teacherId: z.string(),
  programId: z.string(),
  levelId: z.string(),
  studentsIds: z.array(z.string()).optional(),
  classSessions: z.array(classDaysSchema).min(1, "Class must have at least 1 classDays"),
  startDate: z.date(),
  endDate: z.date(),
  color: z.string().optional(),
})

export type TClassDay = z.infer<typeof classDaysSchema>

export type TClassSchema = z.infer<typeof classSchema> & {
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
  students: Partial<Student>[]
  program: {
    id: string
    name: string
  }
  level: {
    id: string
    name: string
  }
  startTime: string
  endTime: string
  day: string
  sessions: {
    id: string
    day: string
    startTime: string
    endTime: string
  }[]
}
