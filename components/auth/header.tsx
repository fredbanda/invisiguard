import Image from "next/image";

interface HeaderProps {
    label: string;
}

export const Header = ({label}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center-gap-y-4">
        <Image src="/logo.png" alt="InvisiGuard" width={248} height={48} className="mb-4" />
        {label}
    </div>
  )
}
