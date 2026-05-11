"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuProps {
  variant: "white" | "transparent";
}

interface Menu {
  id: string;
  label: string;
  submenu?: Menu[];
}

const menus: Menu[] = [
  { id: "/about", label: "About Us" },
  { id: "/contact", label: "Contact Us" },
  {
    id: "#",
    label: "All Pages",
    submenu: [
      { id: "/about", label: "About Us" },
      { id: "/contact", label: "Contact Us" },
      { id: "/faqs", label: "FAQs" },
      { id: "/careers", label: "Career" },
    ],
  },
];

export default function Menu({ variant }: MenuProps) {
  const pathname = usePathname();
  const [checkingOpen, setCheckingOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center justify-center gap-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => setCheckingOpen(!checkingOpen)}
          className={`font-medium font-Euclid xl:px-3 py-2 hover:text-yellow-500 ${
            checkingOpen
              ? "text-yellow-500"
              : variant === "white"
              ? "text-white"
              : "text-black"
          }`}
        >
          Checking & Savings
        </button>

        {checkingOpen && (
          <div className="absolute left-1/2 top-full z-50 mt-7 w-[850px] -translate-x-1/2 rounded-2xl bg-white px-12 py-10 shadow-xl">
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-16">
              <div>
                <h3 className="font-Euclid text-xl font-semibold text-black">
                  Where to start
                </h3>

                <p className="mt-3 max-w-xs font-Euclid text-sm leading-6 text-gray-600">
                  Check out our rates, then get started with smarter, simpler
                  banking.
                </p>

                <Link
                href="/open-account"
                onClick={() => setCheckingOpen(false)}
                className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-Euclid text-sm font-medium text-white hover:bg-gray-800"
              >
                Open Account
              </Link>
              </div>

              <div>
                <h3 className="font-Euclid text-xl font-semibold text-black">
                  What we offer
                </h3>

                <div className="mt-5 space-y-5">
                  <div>
                    <Link
                      href="/checking-savings/spending"
                      onClick={() => setCheckingOpen(false)}
                      className="font-Euclid text-base font-semibold text-black hover:text-yellow-500"
                    >
                      Spending
                    </Link>
                    <p className="mt-1 font-Euclid text-sm text-gray-600">
                      A checking account with no monthly fees.
                    </p>
                  </div>

                  <div>
                    <Link
                      href="/checking-savings/savings"
                      onClick={() => setCheckingOpen(false)}
                      className="font-Euclid text-base font-semibold text-black hover:text-yellow-500"
                    >
                      Savings
                    </Link>
                    <p className="mt-1 font-Euclid text-sm text-gray-600">
                      Smart tools to help give your savings a boost.
                    </p>
                  </div>

                  <div>
                    <Link
                      href="/checking-savings/money-market"
                      onClick={() => setCheckingOpen(false)}
                      className="font-Euclid text-base font-semibold text-black hover:text-yellow-500"
                    >
                      Money market
                    </Link>
                    <p className="mt-1 font-Euclid text-sm text-gray-600">
                      Think savings account, but more flexibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {menus.map((menu) => (
        <div key={menu.label} className="relative group">
          <Link
            href={menu.id}
            className={`font-medium font-Euclid xl:px-3 py-2 ${
              pathname === menu.id
                ? "text-yellow-500"
                : variant === "white"
                ? "text-white"
                : "text-black"
            } hover:text-yellow-500`}
          >
            {menu.label}
          </Link>

          {menu.submenu && (
            <div className="absolute top-full left-0 mt-7 grid w-[400px] grid-cols-2 rounded-lg bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {menu.submenu.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={subItem.id}
                  className="block px-5 py-3 text-black hover:text-yellow-500 font-Euclid"
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}