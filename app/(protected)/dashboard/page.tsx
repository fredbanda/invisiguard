import { auth } from "@/auth";

const DashboardPage = async() => {
  const session = await auth();
  return (
    <div>
      <p className="text-3xl font-bold text-white/80">Welcome to your dashboard, {session?.user?.name}</p>
    </div>
  )
}

export default DashboardPage