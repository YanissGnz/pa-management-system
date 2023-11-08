import prisma from "@/lib/prisma"
import fs from "fs"
import { v4 } from "uuid"
// import { hash } from "bcrypt"

export async function GET() {
  // read the data from the csv file with fs

  try {
    // const exist = await prisma.user.findFirst({
    //   where: {
    //     username: "admin",
    //   },
    // })

    // if (exist) {
    //   return Response.json({ message: "Data already imported" }, { status: 200 })
    // }

    const data = fs.readFileSync("data_efe.csv", "utf8")

    // split the data by rows

    const rows = data.split("\n")

    // get the headers

    const headers = rows[0].split(",")

    // remove the headers from the rows

    rows.shift()

    // map the rows to objects

    const students = rows.map(row => {
      const values = row.split(",")
      // prefill all data

      type SType = {
        id: string
        code: string
        fullName: string
        age: string
        sex: string
        phoneNumber: string
        schoolType: string
        level: string
        paymentStatus: string
        amount: string
        note: string
        registrationStatus: string
        ageCategory: string
        schoolYear: string
        type: string
        address: string
        email: string
        whatsappNumber: string
        parentName: string
        parentNumber: string
        parentEmail: string
        parentAddress: string
        parentOccupation: string
      }

      const student: SType = {
        code: "",
        fullName: "",
        id: "",
        phoneNumber: "",
        address: "",
        age: "",
        ageCategory: "",
        amount: "",
        email: "",
        level: "",
        note: "",
        parentAddress: "",
        parentEmail: "",
        parentName: "",
        parentNumber: "",
        parentOccupation: "",
        paymentStatus: "",
        registrationStatus: "",
        schoolType: "",
        schoolYear: "",
        sex: "",
        type: "",
        whatsappNumber: "",
      }

      headers.forEach((header, index) => {
        student[header as keyof SType] = values[index]
      })

      return student
    })

    // create the students promises

    // const password = await hash("123456789", 10)   1

    // await prisma.user.create({
    //   data: {
    //     name: "admin",
    //     username: "admin",
    //     password,
    //   },
    // })

    students.map(async student => {
      const s = await prisma.student.create({
        data: {
          code: student.code,
          fullName: student.fullName!,
          paymentStatus: student.paymentStatus!,
          note: student.note!,
          type: "individual",
          registrationDate: new Date(),
          level: student.level,
          sex: "unknown",
          parentAddress: "",
          parentName: "",
          registrationStatus: student.registrationStatus!,
          address: "",
          age: 0,
          ageCategory: "adult",
          email: "",
          expectedClasses: [],
          phoneNumber: student.phoneNumber!,
          schoolYear: "2023-2024",
        },
      })
      await prisma.payment.create({
        data: {
          amount: Number(student.amount!),
          date: new Date(),
          discount: 9000 - Number(student.amount!),
          //  dec 31
          due: new Date("2023-12-31"),
          status: student.paymentStatus!,
          total: Number(student.amount!),
          students: {
            connect: {
              id: s.id,
            },
          },
          payedDate: new Date(),
          code: `INV-EFE-${new Date().getFullYear()}-${v4().slice(0, 4).toUpperCase()}`,
          payedAmount:
            student.paymentStatus === "completed"
              ? Number(student.amount!)
              : student.paymentStatus === "incomplete"
              ? Number(student.amount!) / 2
              : 0,
          from: new Date(),
          to: new Date(),
        },
      })
    })

    // wait for the students to be created
  } catch (e) {
    return Response.json({ error: e }, { status: 500 })
  }
  // create the students in the database

  return Response.json({ message: "Data imported successfully" }, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"
