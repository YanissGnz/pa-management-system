import { TPaymentSchema } from "@/types/Payment"
import { TTeacherSchema } from "@/types/Teacher"

export const getTeachers = async (): Promise<TTeacherSchema[]> => {
  const teachers = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teachers`, {
    cache: "no-cache",
  }).then(res => res.json())

  return teachers
}

export const getStudents = async () => {
  const students = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/students`, {
    cache: "no-cache",
  }).then(res => res.json())

  return students
}

export const getStudentById = async (id: string) => {
  const student = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/students/${id}`, {
    cache: "no-cache",
  }).then(res => res.json())

  return student
}

export const getClasses = async () => {
  const classes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/classes`, {
    cache: "no-cache",
  }).then(res => res.json())

  return classes
}

export const getSessions = async () => {
  const sessions = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sessions`, {
    cache: "no-cache",
  }).then(res => res.json())

  return sessions
}

export const getPrograms = async () => {
  const programs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/programs`, {
    cache: "no-cache",
  }).then(res => res.json())

  return programs
}

export const getPayments = async (): Promise<TPaymentSchema[]> => {
  const payments = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments`, {
    cache: "no-cache",
  }).then(res => res.json())

  return payments
}

export const getClassById = async (id: string) => {
  const classes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/${id}`, {
    cache: "no-cache",
  }).then(res => res.json())

  return classes
}

export const getProgramById = async (id: string) => {
  const programs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/programs/${id}`, {
    cache: "no-cache",
  }).then(res => res.json())

  return programs
}
