import { TLevelSchema } from "./Level"
import { TProgramSchema } from "./Program"
import { TTeacherSchema } from "./Teacher"

export type TSession = {
  id: string
  title: string
  color?: string | null
  teacher?: TTeacherSchema | null
  program?: Partial<TProgramSchema> | null
  level?: Partial<TLevelSchema> | null
  description: string | null
  start: Date
  end: Date
  students: {
    id: string
    fullName: string
    email: string | null
  }[]
  attendance: string[]
}
