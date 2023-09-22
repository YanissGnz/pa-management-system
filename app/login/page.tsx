// sections
import LoginForm from "@/sections/login/LoginForm";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold">Sign in</h1>

      <LoginForm />
    </div>
  );
}
