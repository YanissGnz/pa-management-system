import Image from "next/image";
// sections
import RegisterForm from "@/sections/register/RegisterForm";
// utils
import { cn } from "@/lib/utils";
// assets
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div
      className={cn("relative flex h-full flex-col justify-center space-y-5 px-5 sm:px-16", "md:mx-auto md:flex-[0.6]")}
    >
      <p className="absolute right-0 top-5 self-end text-sm">
        <Link href="/login" prefetch>
          <Button variant="link" className="px-0">
            Sign in
          </Button>
        </Link>
      </p>

      <h1 className="text-3xl font-bold">Sign up</h1>
      <RegisterForm />
    </div>
  );
}
