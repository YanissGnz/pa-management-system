import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from '@/types/Register';

export async function POST(req: Request) {
  // parse with zod
  const body = await req.json();

  const result = registerSchema.safeParse(body);

  var zodErrors = {}

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
    })
    return NextResponse.json({ errors: zodErrors }, { status: 400 });
  }
  const { name, email, password } = result.data;

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    zodErrors = { ...zodErrors, email: "Email already exists" }
    return NextResponse.json({ errors: zodErrors }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
