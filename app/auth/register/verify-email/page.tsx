import { verifyCredentialsEmailAction } from "@/actions/verify-credentials-email-action";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { getVerificationTokenByToken } from "@/resources/verification-token-queries";
import { TriangleAlertIcon } from "lucide-react";
import { FaGlassCheers} from "react-icons/fa";

type PageProps = {
    searchParams: {token: string}
  }

export default async function Page({ searchParams }: PageProps) {
    const verificationToken = await getVerificationTokenByToken(searchParams.token);

    if(!verificationToken?.expires) return <TokenIsInvalidState />

    const isExpired = new Date(verificationToken.expires) < new Date();

    if(isExpired) return <TokenIsInvalidState />

    const res = await verifyCredentialsEmailAction(searchParams.token);

    if(!res.success) return <TokenIsInvalidState />


    return (
      <CardWrapper
        headerLabel="Email Verified Successfully"
        backButtonLabel="Click here to login to your account"
        backButtonHref="/auth/login"
        showSocialButton={false}
      >
        <div className="container">
            <div className="my-2 h-2 bg-emerald-400" />
            <div className="flex items-center rounded text-emerald-500 gap-x-4">
            <FaGlassCheers className="text-pink-800 w-6 h-6"/>
              <p>Your email has been verified successfully.</p>
            </div>
          </div>
      </CardWrapper>
    );
  }
  

const TokenIsInvalidState = () => {
  return (
    <CardWrapper
      headerLabel="Verify Your Email"
      backButtonLabel="Click here to request a new verification link"
      backButtonHref="/auth/login"
      showSocialButton={false}
    >
      <div className="container">
    
          <div className="flex items-center rounded text-red-500 gap-x-4 ">
            <TriangleAlertIcon className="h-6 w-6 text-red-500 " />
             <p>Your verification link has expired!</p>
          </div>
        </div>
    </CardWrapper>
  );
};
