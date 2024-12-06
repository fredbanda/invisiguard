"use client";

import { useSession } from "next-auth/react";
import SignedIn from "./signed-in";
import { SignedOut } from "./signed-out";


export const NavbarLinks = () => {
  const { data: session, status } = useSession(); // Fetch client-side session

  if (status === "loading") {
    return <div>Loading...</div>; // Show loading state while session is being fetched
  }

  return !!session?.user ? <SignedIn /> : <SignedOut />;
};

export default NavbarLinks;

