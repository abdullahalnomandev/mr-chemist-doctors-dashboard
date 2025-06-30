// import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default async function RegisterPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40'>
      <div className='w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-lg'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Admin Registration</h1>
          <p className='text-muted-foreground mt-2'>
            Create your admin account
          </p>
        </div>
        {/* <RegisterForm /> */}
        <div className='text-center text-sm'>
          Already have an account?
          <Link href='/auth/login' className='text-primary hover:underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
