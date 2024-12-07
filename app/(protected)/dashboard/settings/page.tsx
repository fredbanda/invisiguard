import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { UpdateUserInfoForm } from "@/components/auth/update-user-info";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";

const SettingsPage = async () => {
  const session = await auth();

  console.log(session?.user)
  return (
    <main className="mt-4">
      <div className="container">
        <h3 className="w-full text-3xl font-bold tracking-tight text-white/80 text-center">
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
  <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
    <h2 className="text-2xl font-bold tracking-tight text-white/80 text-center">User Information for {user.name || "User"}</h2>
    <UpdateUserInfoForm user={user} />

  </div>
  
  <Card className="w-[600px] shadow-md text-bold">
      <CardHeader>
      
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p>{user?.id}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p>{user?.name}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p>{user?.email}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Company</p>
          <p>{user?.company}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Phone Number</p>
          <p>{user?.phone}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p>{user?.role.toUpperCase()}</p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge></Badge>
        </div>
      </CardContent>
    </Card>
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

      <Button asChild variant="default" size="lg" className="p-4 w-full">
        <Link href="/auth/login"> Sign In</Link>
      </Button>
      <div className="my-4 h-2 bg-muted" />
    </>
  );
};
