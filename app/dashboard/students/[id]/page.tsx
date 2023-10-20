import { Metadata } from "next"
// api
import { getStudentById } from "@/lib/apis"
// types
import { TStudentSchema } from "@/types/Student"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Student Details",
  description: "Student Details",
}

export default async function StudentsList({ params: { id } }: { params: { id: string } }) {
  const student: TStudentSchema = await getStudentById(id)

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading={`${student.fullName}'s details`} />
      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='classes'>Classes History</TabsTrigger>
          <TabsTrigger value='payments'>Payments History</TabsTrigger>
        </TabsList>
        <TabsContent value='general' className='grid grid-cols-2 gap-5'>
          <Card>
            <CardHeader>
              <CardTitle>Student Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p>
                  <span className='text-lg font-semibold'>Full name:</span> {student.fullName}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Phone number:</span>{" "}
                  {student.phoneNumber || "N/A"}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Email:</span> {student.email || "N/A"}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Age:</span> {student.age} years old
                </p>
                <p>
                  <span className='text-lg font-semibold'>Level:</span> {student.level}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Address:</span> {student.address || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Parent Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p>
                  <span className='text-lg font-semibold'>Full name:</span>{" "}
                  {student.parentName || "N/A"}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Phone number:</span>{" "}
                  {student.parentNumber || "N/A"}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Email:</span>{" "}
                  {student.parentEmail || "N/A"}
                </p>
                <p>
                  <span className='text-lg font-semibold'>Occupation:</span>{" "}
                  {student.parentOccupation || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className='col-span-2'>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>{student.note ? student.note : <p>No comments</p>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='classes'></TabsContent>
        <TabsContent value='payments'></TabsContent>
      </Tabs>
    </main>
  )
}
