"use server"

import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { revalidateTag } from "next/cache"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { TTeacherSchema, teacherSchema } from "@/types/Teacher"
import { TStudentSchema, studentSchema } from "@/types/Student"
import { TClassSchema, classSchema } from "@/types/Class"
import { TProgramSchema, programSchema } from "@/types/Program"
import { TPaymentSchema, paymentSchema } from "@/types/Payment"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { authOptions } from "@/lib/utils/authOptions"

export type TActionReturn<TSchema> = {
  errors?: string | { [K in keyof TSchema]?: string }
  status: number
  success?: boolean
}

type ZodErrors<T> = { [K in keyof T]?: string } | { message: string }

// Teachers Actions
export const addTeacher = async (
  formData: TTeacherSchema
): Promise<TActionReturn<TTeacherSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  const result = teacherSchema.safeParse(formData)

  let zodErrors: ZodErrors<TTeacherSchema> = {}
  if (result.success) {
    try {
      const { email, firstName, lastName, password, address, phoneNumber } = result.data
      const exist = await prisma.teacher.findUnique({
        where: {
          email,
        },
      })
      if (exist) {
        zodErrors = { ...zodErrors, email: "Email already exists" }
        return { errors: zodErrors, status: 400 }
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.teacher.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          address,
          phoneNumber,
        },
      })
      revalidateTag("teachers")
      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:64 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }
  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
  // with jwt auth
}

export const deleteTeacher = async (id: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  try {
    await prisma.teacher.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:82 ~ deleteTeacher ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("teachers")

  return { status: 200, success: true }
}

export const updateTeacher = async (
  formData: TTeacherSchema,
  id: string
): Promise<TActionReturn<TTeacherSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  const result = teacherSchema.safeParse(formData)

  let zodErrors: ZodErrors<TTeacherSchema> = {}

  if (result.success) {
    try {
      const { email, firstName, lastName, password, address, phoneNumber } = result.data

      const exist = await prisma.teacher.findUnique({
        where: {
          email,
        },
      })

      if (exist && exist.id !== id) {
        zodErrors = { ...zodErrors, email: "Email already exists" }
        return { errors: zodErrors, status: 400 }
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await prisma.teacher.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          address,
          phoneNumber,
        },
      })

      revalidateTag("teachers")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:133 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

// Students Actions

export const addStudent = async (
  formData: TStudentSchema
): Promise<TActionReturn<TStudentSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  const result = studentSchema.safeParse(formData)

  if (result.success) {
    try {
      const {
        fullName,
        phoneNumber,
        address,
        age,
        email,
        level,
        parentEmail,
        parentName,
        parentNumber,
        parentOccupation,
        schoolYear,
        type,
        whatsappNumber,
        ageCategory,
        expectedClasses,
        Kids,
        Partner,
        schoolType,
        sex,
      } = result.data

      const student = await prisma.student.create({
        data: {
          code: `PRE-${uuidv4().slice(0, 4).toUpperCase()}`,
          ageCategory: ageCategory || "adult",
          fullName,
          phoneNumber,
          address,
          age,
          email,
          level,
          parentEmail,
          parentName,
          parentNumber,
          parentOccupation,
          schoolYear,
          type,
          whatsappNumber,
          registrationStatus: "preregistered",
          registrationDate: new Date(),
          schoolType,
          paymentStatus: type === "special" ? "special" : "unpaid",
          sex,
          expectedClasses,
        },
      })

      if (Partner) {
        const partnerStudent = await prisma.student.create({
          data: {
            code: `PRE-${uuidv4().slice(0, 4).toUpperCase()}`,
            ageCategory: "adult",
            fullName: Partner.fullName!,
            phoneNumber: Partner.phoneNumber!,
            address,
            age: Partner.age,
            email: Partner.email!,
            level: Partner.level!,
            type: "family",
            whatsappNumber: Partner.whatsappNumber,
            registrationStatus: "preregistered",
            registrationDate: new Date(),
            paymentStatus: "unpaid",
            sex: sex === "male" ? "female" : "male",
          },
        })
        const p = await prisma.partner.create({
          data: {
            studentId: partnerStudent.id,
            partnerId: student.id,
          },
        })

        await prisma.student.update({
          where: { id: student.id },
          data: { Partner: { connect: { id: p.id } } },
        })
      }

      if (Array.isArray(Kids) && Kids?.length > 0) {
        Kids?.forEach(async k => {
          const kidStudent = await prisma.student.create({
            data: {
              code: `PRE-${uuidv4().slice(0, 4).toUpperCase()}`,
              ageCategory: "kid",
              fullName: k.fullName!,
              phoneNumber,
              address,
              age: k.age,
              email,
              level: k.level!,
              parentEmail: email,
              parentName: fullName,
              parentNumber: phoneNumber,
              schoolYear: k.schoolYear!,
              type: "family",
              whatsappNumber,
              registrationStatus: "preregistered",
              registrationDate: new Date(),
              schoolType: k.schoolType!,
              paymentStatus: "unpaid",
              sex: k.sex,
            },
          })
          const kid = await prisma.kid.create({
            data: { studentId: kidStudent.id, parentId: student.id },
          })

          await prisma.student.update({
            where: { id: student.id },
            data: {
              Kids: {
                connect: { id: kid.id },
              },
            },
          })
        })
      }
      revalidateTag("students")
      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:284 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }
  let zodErrors: ZodErrors<TStudentSchema> = {}
  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const deleteStudent = async (id: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.student.delete({
      where: { id },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:300 ~ deleteStudent ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("students")

  return { status: 200, success: true }
}

export const updateStudent = async (
  formData: TStudentSchema,
  id: string
): Promise<TActionReturn<TStudentSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  const result = studentSchema.safeParse(formData)

  let zodErrors: ZodErrors<TStudentSchema> = {}

  if (result.success) {
    const {
      fullName,
      phoneNumber,
      address,
      age,
      email,
      level,
      parentEmail,
      parentName,
      parentNumber,
      parentOccupation,
      schoolYear,
      type,
      whatsappNumber,
      ageCategory,
      expectedClasses,
      schoolType,
      sex,
    } = result.data
    try {
      await prisma.student.update({
        where: { id },
        data: {
          fullName,
          email,
          phoneNumber,
          address,
          age,
          level,
          parentEmail,
          parentName,
          parentNumber,
          parentOccupation,
          schoolYear,
          type,
          whatsappNumber,
          ageCategory,
          expectedClasses,
          schoolType,
          sex,
        },
      })

      revalidateTag("students")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:366 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const assignStudentToClass = async (studentId: string, classId: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }

  try {
    const Class = await prisma.class.findUnique({ where: { id: classId } })

    if (!Class) {
      return { status: 404, success: false, errors: "Class not found" }
    }

    const sessions = await prisma.session.findMany({
      where: {
        title: Class.title,
      },
    })

    if (!sessions) {
      return { status: 404, success: false, errors: "Class not found" }
    }

    await prisma.student.update({
      where: { id: studentId },
      data: {
        classes: { connect: { id: classId } },
        sessions: { connect: sessions.map(s => ({ id: s.id })) },
        expectedClasses: [],
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:403 ~ assignStudentToClass ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("students")

  return { status: 200, success: true }
}

export const assignMultipleStudentsToSession = async (studentsIds: string[], sessionId: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        students: { connect: studentsIds.map(id => ({ id })) },
      },
    })

    await prisma.student.updateMany({
      where: { id: { in: studentsIds } },
      data: {
        expectedClasses: [],
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:442 ~ assignMultipleStudentsToSession ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("students")

  return { status: 200, success: true }
}

// Classes Actions

export const addClass = async (formData: TClassSchema): Promise<TActionReturn<TClassSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  const result = classSchema.safeParse(formData)

  let zodErrors: ZodErrors<TClassSchema> = {}

  if (result.success) {
    const { title, description, teacherId, programId, endDate, levelId, classSessions, startDate } =
      result.data
    try {
      const sessionsPromises: Prisma.Prisma__SessionClient<
        {
          id: string
          title: string
          description: string | null
          teacherId: string
          programId: string
          levelId: string
          start: Date
          end: Date
          color: string | null
        },
        never,
        DefaultArgs
      >[] = []

      const classesPromises: Prisma.Prisma__ClassClient<
        {
          id: string
          title: string
          description: string | null
          teacherId: string
          programId: string
          levelId: string
          startDate: Date
          endDate: Date
          day: string
          startTime: string
          endTime: string
          color: string | null
        },
        never,
        DefaultArgs
      >[] = []

      const dayStringToNumber = (day: string) => {
        switch (day) {
          case "sunday":
            return 0
          case "monday":
            return 1
          case "tuesday":
            return 2
          case "wednesday":
            return 3
          case "thursday":
            return 4
          case "friday":
            return 5
          case "saturday":
            return 6
          default:
            return 0
        }
      }

      classSessions.forEach(async d => {
        const { startTime, endTime, day, color } = d
        const start = new Date(startDate)
        start.setDate(start.getDate() + ((7 + dayStringToNumber(day) - start.getDay()) % 7))
        const end = new Date(endDate)
        end.setDate(end.getDate() + ((7 + dayStringToNumber(day) - end.getDay()) % 7))

        for (let date = start; date <= end; date.setDate(date.getDate() + 7)) {
          sessionsPromises.push(
            prisma.session.create({
              data: {
                title,
                description,
                color,
                teacherId,
                programId,
                levelId,
                start: new Date(
                  date.setHours(Number(startTime.split(":")[0]), Number(startTime.split(":")[1]))
                ),
                end: new Date(
                  date.setHours(Number(endTime.split(":")[0]), Number(endTime.split(":")[1]))
                ),
              },
            })
          )
        }
        classesPromises.push(
          prisma.class.create({
            data: {
              title,
              day,
              startTime,
              endTime,
              startDate,
              endDate,
              description,
              levelId,
              programId,
              teacherId,
              color,
            },
          })
        )
      })

      await prisma.$transaction(sessionsPromises)
      await prisma.$transaction(classesPromises)

      revalidateTag("classes")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:531 ~ addClass ~ error:", error)

      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const updateClass = async (
  formData: TClassSchema,
  id: string
): Promise<TActionReturn<TClassSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  const result = classSchema.omit({ classSessions: true }).safeParse(formData)

  let zodErrors: ZodErrors<TClassSchema> = {}

  if (result.success) {
    const { title, description, teacherId, programId, endDate, levelId, startDate } = result.data
    try {
      const sessionsPromises: Prisma.Prisma__SessionClient<
        {
          id: string
          title: string
          description: string | null
          teacherId: string
          programId: string
          levelId: string
          start: Date
          end: Date
          color: string | null
        },
        never,
        DefaultArgs
      >[] = []

      const newClass = await prisma.class.update({
        where: { id },
        data: { title, description, teacherId, programId, endDate, levelId, startDate },
        include: { sessions: true },
      })

      newClass.sessions.forEach(async s => {
        sessionsPromises.push(
          prisma.session.update({
            where: { id: s.id },
            data: {
              title,
              description,
              teacherId,
              programId,
              levelId,
            },
          })
        )
      })

      await prisma.$transaction(sessionsPromises)

      revalidateTag("classes")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:531 ~ addClass ~ error:", error)

      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const deleteClass = async (id: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.class.delete({ where: { id } })
  } catch (error) {
    return { status: 500, success: false, errors: "Internal Server Error" }
  }
  revalidateTag("classes")

  return { status: 200, success: true }
}

export const updateSessionAttendance = async (sessionId: string, studentsIds: string[]) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        attendance: studentsIds,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:442 ~ assignMultipleStudentsToSession ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("students")

  return { status: 200, success: true }
}

export const assignStudentsToClass = async (classId: string, studentsIds: string[]) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    const Class = await prisma.class.findUnique({ where: { id: classId } })

    if (!Class) {
      return { status: 404, success: false, errors: "Class not found" }
    }

    const sessions = await prisma.session.findMany({
      where: {
        title: Class.title,
      },
    })

    if (!sessions) {
      return { status: 404, success: false, errors: "Class not found" }
    }

    await prisma.class.update({
      where: { id: classId },
      data: {
        students: { connect: studentsIds.map(id => ({ id })) },
      },
    })

    // create students promises

    const studentsPromises: Prisma.Prisma__StudentClient<
      {
        id: string
        code: string
        fullName: string
        address: string | null
        phoneNumber: string | null
        email: string | null
        type: string
        age: number | null
        ageCategory: string | null
        level: string | null
        schoolYear: string | null
        parentName: string | null
        parentNumber: string | null
        parentEmail: string | null
        parentOccupation: string | null
        whatsappNumber: string | null
        registrationStatus: string
        registrationDate: Date
        paymentStatus: string
        sex: string | null
        schoolType: string | null
        note: string | null
      },
      never,
      DefaultArgs
    >[] = []

    studentsIds.forEach(async id => {
      studentsPromises.push(
        prisma.student.update({
          where: { id },
          data: {
            classes: { connect: { id: classId } },
            sessions: { connect: sessions.map(s => ({ id: s.id })) },
            expectedClasses: [],
          },
        })
      )
    })

    await prisma.$transaction(studentsPromises)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:442 ~ assignMultipleStudentsToSession ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("students")

  return { status: 200, success: true }
}

// Programs Actions

export const addProgram = async (
  formData: TProgramSchema
): Promise<TActionReturn<TProgramSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  const result = programSchema.safeParse(formData)

  let zodErrors: ZodErrors<TClassSchema> = {}

  if (result.success) {
    try {
      const { name, description, levels } = result.data

      await prisma.program.create({
        data: {
          name,
          description,
          levels: {
            create: levels,
          },
        },
      })

      revalidateTag("programs")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:596 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const deleteProgram = async (id: string) => {
  try {
    await prisma.program.delete({ where: { id } })

    revalidateTag("programs")

    return { status: 200, success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:804 ~ error:", error)
    return { status: 500, success: false, errors: "Program deletion failed" }
  }
}
// Payments Actions

export const addPayment = async (
  formData: TPaymentSchema
): Promise<TActionReturn<TPaymentSchema>> => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  const result = paymentSchema.safeParse(formData)

  if (result.success) {
    const {
      amount,
      date,
      discount,
      payedAmount,
      period,
      studentId,
      note,
      due,
      kidsIds,
      partnerId,
    } = result.data
    const total = Number(amount) - Number(discount)
    const status =
      !payedAmount || payedAmount === 0 ? "unpaid" : payedAmount === total ? "paid" : "partial"

    const studentsIds = [studentId]

    if (partnerId) {
      await prisma.partner
        .findUnique({
          where: {
            id: partnerId,
          },
        })
        .then(partner => {
          if (partner) {
            studentsIds.push(partner.studentId)
          }
        })
    }

    if (kidsIds) {
      await prisma.kid
        .findMany({
          where: {
            id: {
              in: kidsIds,
            },
          },
        })
        .then(kids => {
          if (kids) {
            studentsIds.push(...kids.map(k => k.studentId))
          }
        })
    }

    try {
      await prisma.payment.create({
        data: {
          amount: Number(amount),
          code: `INV-${new Date().getFullYear()}-${uuidv4().slice(0, 4).toUpperCase()}`,
          date,
          discount: Number(discount),
          payedAmount: Number(payedAmount),
          period,
          status,
          note,
          total,
          due,
          payedDate: payedAmount ? new Date() : null,
          students: {
            connect: [...studentsIds.map(id => ({ id }))],
          },
        },
        include: {
          students: true,
        },
      })

      await prisma.student.updateMany({
        where: {
          id: {
            in: studentsIds,
          },
        },
        data: {
          paymentStatus: status,
          registrationStatus: "registered",
        },
      })

      revalidateTag("payments")

      return { status: 200, success: true }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("🚀 ~ file: actions.ts:711 ~ error:", error)
      return { status: 500, success: false, errors: "Internal Server Error" }
    }
  }

  let zodErrors: ZodErrors<TPaymentSchema> = {}
  result.error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
  })
  return { errors: zodErrors, status: 400 }
}

export const archivePayment = async (id: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.payment.update({
      where: { id },
      data: { archived: true },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:731 ~ archivePayment ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("payments")

  return { status: 200, success: true }
}

export const completePayment = async (id: string) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return { status: 401, errors: "Unauthorized" }
  }
  try {
    await prisma.payment.update({
      where: { id },
      data: {
        status: "paid",
        payedDate: new Date(),
        payedAmount: await prisma.payment.findUnique({ where: { id } }).then(p => p?.total),
      },
    })
    const payment = await prisma.payment.findUnique({ where: { id }, include: { students: true } })

    await prisma.student.updateMany({
      where: {
        id: {
          in: payment?.students.map(s => s.id) || [],
        },
      },
      data: {
        paymentStatus: "paid",
        registrationStatus: "registered",
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ file: actions.ts:765 ~ completePayment ~ error:", error)
    return { status: 500, success: false, errors: "Internal Server Error" }
  }

  revalidateTag("payments")

  return { status: 200, success: true }
}
