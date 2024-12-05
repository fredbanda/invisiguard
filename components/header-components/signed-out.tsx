"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export const SignedOut = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Links (Hidden on Mobile) */}
        <div className="hidden sm:flex sm:items-center sm:space-x-4">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Contact
          </Link>
        </div>

        {/* Buttons (Login/Register) */}
        <div className="hidden sm:flex sm:space-x-4">
          <Button variant="custom" size="lg" asChild className="ml-6">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="custom" size="lg" asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-32" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-white bg-gray-900"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Contact
            </Link>
            <Button
              variant="custom"
              size="lg"
              className="block w-full text-center"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              variant="custom"
              size="lg"
              className="block w-full text-center"
              asChild
            >
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
