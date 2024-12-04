import Link from "next/link";
import { Button } from "../ui/button";
import { LogoutButton } from "../auth/logout-button";
import { auth } from "@/auth";
import Image from "next/image";

export const NavbarLinks = async () => {
  const session = await auth();

  return !!session?.user ? <SignedIn /> : <SignedOut />;
};

const SignedIn = () => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            //onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={true}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <svg
              className="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Logo and Links */}
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                aria-current="page"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/services"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Services
              </Link>
              <Link
                href="/dashboard/support"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Support
              </Link>
              <Link
                href="#"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Calendar
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-3">
          <button
            type="button"
            className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            //   aria-expanded
            //   aria-haspopup="true"
            //   onClick={() => {}}
          >
            <span className="sr-only">Open user menu</span>
            <Image
              className="h-8 w-8 rounded-full"
              src="/user.png"
              alt="User Profile"
              width={40}
              height={40}
            />
          </button>

          <div
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Your Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Settings
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const SignedOut = () => {
  return (
    <>
    <li>
      <Link
        href="/"
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Home
      </Link>
      </li>
      <li>
      <Link
        href="/about"
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        About Us
      </Link>
      </li>
      <li>
      <Link
        href="contact"
        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Contact
      </Link>
      </li>
      <li>
        <Button variant="custom" size="lg" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </li>
      <li>
        <Button variant="custom" size="lg" asChild>
          <Link href="/auth/register">Register</Link>
        </Button>
      </li>
    </>
  );
};
