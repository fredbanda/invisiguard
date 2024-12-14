import { auth } from "@/auth"
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/resources/user-queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImArrowUpLeft2 } from "react-icons/im";
import { ToggleEmailVerifiedInput } from "./_components/toggle-email-verified-input";
import { ChangeUserRoleInput } from "./_components/change-user-role-input";

const AdminPage = async () => {
    const session = await auth();

    if(session?.user?.role !== USER_ROLES.ADMIN) redirect('/dashboard')

    const users = await getAllUsers();

  return (
    <main className="mt-4">
    <div className="container">
      <div className="flex items-center justify-between">
      <h1 className="w-full text-3xl font-bold tracking-tight text-white/80 text-center">
        Admin Dashboard
      </h1>
      </div>
      <h3 className="w-full text-3xl font-bold tracking-tight text-white/80 text-center">
        All Users
      </h3>
      
      <div className="my-4 h-2 bg-muted" />
      <table className="mt-4 w-full table-auto divide-y rounded-md">
        <thead>
            <tr className="divide-x">
                <th className="bg-primary-foreground px-6 py-3 text-start">ID</th>
                <th className="bg-primary-foreground px-6 py-3 text-start">Name</th>
                <th className="bg-primary-foreground px-6 py-3 text-start">Email</th>
                <th className="bg-primary-foreground px-6 py-3 text-start">Email Verified</th>
                <th className="bg-primary-foreground px-6 py-3 text-start">Role</th>
            </tr>
        </thead>

        <tbody className="text-white/80">
            {users.map((user) => {
                return <tr key={user.id}
                className={cn("divide-x", {
                    "bg-green-900": user.role === USER_ROLES.ADMIN,
                    "bg-slate-600": user.role === USER_ROLES.USER,
                })}
                >
                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <ToggleEmailVerifiedInput 
                            email={user.email}
                            emailVerified={user.emailVerified}
                            isAdmin={user.role === USER_ROLES.ADMIN}
                        />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <ChangeUserRoleInput
                        email={user.email}
                        currentRole={user.role}
                        isAdmin={user.role === USER_ROLES.ADMIN}
                     />
                    </td>                    
                </tr>
            })}
        </tbody>
      </table>
      <div className="my-4 h-2 bg-muted" />
      <ReturnToDashboardButton />
    </div>
    </main>
  )
}

export default AdminPage

const ReturnToDashboardButton = () => {
    return<Button asChild variant="default" size="lg" className="p-4 w-full">
      <Link href="/dashboard">
      <ImArrowUpLeft2 className="mr-2 h-6 w-6" />
      Back To Dashboard
      </Link>
    </Button>
  }