import { CardWrapper } from "@/components/auth/card-wrapper";
import { FaGlassCheers } from "react-icons/fa";

export default function Page() {
  return (
    <CardWrapper
      headerLabel="Verification Email Sent!!"
      backButtonLabel="Click here to login"
      backButtonHref="/auth/login"
      showSocialButton={false}
    >
      <div className="flex items-center gap-x-4 rounded text-emerald-500">
        <FaGlassCheers className="text-pink-800 w-6 h-6"/>
        <p className="text-emerald-500">
          Please check your email to verify your account!
        </p>
      </div>
    </CardWrapper>
  );
}
