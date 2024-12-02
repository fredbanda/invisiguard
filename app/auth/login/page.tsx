import { LoginForm } from "@/components/auth/login-form"

const LoginPage = () => {
  return (
    <div className="mt-4 ">
    <div className="container flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tight text-black mt-[-30px] ">
        <LoginForm />
        </h1>
        <div className="'h-1 bg-muted my-4" />
    </div>
</div>

    
  )
}

export default LoginPage