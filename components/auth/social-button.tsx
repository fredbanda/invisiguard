"use client";

import { Button } from "@/components/ui/button"; // Ensure this is client-safe
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SocialButton = () => {
  // const onClick = (provider: "google" | "github") => {
  //   signIn(provider, {
  //     callbackUrl: DEFAULT_LOGIN_REDIRECT, // Ensure this is client-safe
  //   });
  // };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        //onClick={() => onClick("google")}
      >
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        //onClick={() => onClick("github")}
      >
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

