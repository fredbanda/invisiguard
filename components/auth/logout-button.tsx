"use client";

import { logoutAction } from "@/actions/logout-action";
import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
    const clickHandler = async () => {
        await logoutAction();
        window.location.href = "/";
    }

  return (
        <>
            <Button variant="default" size="lg" onClick={clickHandler} className="w-full hover:bg-red-700">
                Logout
            </Button>
        </>
  )
}
