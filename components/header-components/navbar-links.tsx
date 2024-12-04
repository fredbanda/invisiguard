import { auth } from "@/auth";
import SignedIn from "./signed-in";
import { SignedOut } from "./signed-out";

export const NavbarLinks = async () => {
  const session = await auth();

  return !!session?.user ? <SignedIn /> : <SignedOut />;
};


