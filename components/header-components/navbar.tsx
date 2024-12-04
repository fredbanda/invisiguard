import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="h-14 bg-gray-800 shadow-md border-b border-gray-700  ">
      <div className="h-full container flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Invisiguard Logo"
            width={140}
            height={50}
            className="rounded-md"
          />
        </Link>

        <ul className="flex items-center gap-x-4">
            <li>
                <Button variant="custom" size="lg" asChild>
                    <Link href="/auth/login">Login
                    </Link>
                </Button>
            </li>
            <li>
                <Button variant="custom" size="lg" asChild>
                    <Link href="/auth/register">Register
                    </Link>
                </Button>
            </li>
        </ul>
      </div>
    </nav>
  );
};
