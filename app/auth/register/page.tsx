import { RegisterForm } from "@/components/auth/register-form"

const RegisterPage = () => {
  return (

    <div className=" ">
        <div className="container flex flex-col items-center justify-center" >
            <RegisterForm />
            <div className="'h-1 bg-muted my-4" />
        </div>
    </div>
    
  )
}

export default RegisterPage