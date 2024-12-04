import Image from "next/image";
import Link from "next/link";
import { NavbarLinks } from "./navbar-links";

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
            className="rounded-md "
          />
        </Link>

        <ul className="flex items-center gap-x-4">
          <NavbarLinks />
        </ul>
      </div>
    </nav>
  );
};
