import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import Link from "next/link";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <main className="mt-4">
      <div className="container">
        <h3 className="w-full text-3xl font-bold tracking-tight text-white/80">
          Settings Page
        </h3>
        <div className="my-4 h-2 bg-muted" />

        {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
      </div>
    </main>
  );
};

export default SettingsPage;

const SignedIn = ({user}: {user: User}) => {
  return <>
  <h2 className="text-2xl font-bold tracking-tight text-white/80">User Information for {user.name || "User"}</h2>
  <table className="mt-4 table-auto divide-y">
    <thead>
      <tr className="divide-x ">
        <th className="bg-gray-50 px-6 py-3 text-start ">Name</th>
        <th className="bg-gray-50 px-6 py-3 text-start">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr className="divide-x">
        <td className="px-6 py-3 text-white/80">{user.name || null}</td>
        <td className="px-6 py-3 text-white/80">{user.email }</td>
        </tr>
    </tbody>
  </table>
  <div className="my-4 h-2 bg-muted" />
    <LogoutButton />
  </>;
};

const SignedOut = () => {
  return (
    <>
      <div className="h2 text-2xl font-bold tracking-tight">
        User Not Signed In. Please Sign In
      </div>
      <div className="my-4 h-2 bg-muted" />

      <Button asChild variant="custom" size="lg">
        <Link href="/auth/login"> Sign In</Link>
      </Button>
    </>
  );
};
