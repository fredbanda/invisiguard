const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
<div className="min-h-screen w-full flex flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,#1b2735_30%,transparent_60%),conic-gradient(from_135deg,#8fd3f4_0%,#6b8df8_50%,#4a74e0_100%)] bg-cover bg-center bg-no-repeat">
  {children}
</div>

  )
}

export default AuthLayout