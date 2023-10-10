import { z } from "zod"
import { TStudentSchema } from "./Student"

export const paymentSchema = z.object({
  code: z.string().optional(),
  amount: z.number().min(1, "Amount must be at least 1"),
  date: z.date(),
  studentId: z.string(),
  period: z.string(),
  status: z.string(),
  discount: z.number().min(0, "Discount must be at least 0"),
  note: z.string().optional(),
  payedAmount: z.number().min(0, "Payed amount must be at least 0"),
  due: z.date(),
  partnerId: z.string().optional(),
  kidsIds: z.array(z.string()).optional(),
})

export type TPaymentSchema = z.infer<typeof paymentSchema> & {
  id: string
  students?: Partial<TStudentSchema>[]
  payedDate: Date
  total: number
}
