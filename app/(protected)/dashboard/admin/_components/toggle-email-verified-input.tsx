"use client";

import { toggleEmailVerifiedAction } from "@/actions/admin/toggle-email-verified-input";
import { users } from "@/drizzle/schema";
import { useTransition } from "react";

type ToggleEmailVerifiedInputProps = {
  email: (typeof users.$inferSelect)["email"];
  emailVerified: (typeof users.$inferSelect)["emailVerified"];
  isAdmin: boolean;
};

export const ToggleEmailVerifiedInput = ({
  email,
  emailVerified,
  isAdmin,
}: ToggleEmailVerifiedInputProps) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = (email: string, isCurrentlyVerified: boolean) => {
    startTransition(() => {
      // Used a regular function inside startTransition
      toggleEmailVerifiedAction(email, isCurrentlyVerified).catch((error) => {
        console.error("Error toggling email verification:", error);
      });
    });
  };

  return (
    <div className="flex items-center justify-center">
      <input
        disabled={isAdmin || isPending}
        type="checkbox"
        checked={!!emailVerified}
        className="scale-150 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        readOnly
        onClick={clickHandler.bind(null, email, !!emailVerified)}
      />
    </div>
  );
};
