"use client";

import { useSession } from "next-auth/react";
import SignedIn from "./signed-in";
import { SignedOut } from "./signed-out";
import { ImSpinner3 } from "react-icons/im";


export const NavbarLinks = () => {
  const { data: session, status } = useSession(); // Fetch client-side session

  if (status === "loading") {
    return <div>
      <ImSpinner3 className="animate-spin h-8 w-8 text-white" />
    </div>; // Show loading state while session is being fetched
  }

  return !!session?.user ? <SignedIn /> : <SignedOut />;
};

export default NavbarLinks;

