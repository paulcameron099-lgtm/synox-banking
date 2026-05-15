"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/HeaderButton";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import { RiMenu3Fill } from "react-icons/ri";
import { AppDispatch, RootState } from "@/redux/store";
import { setOpen } from "@/redux/HeaderSlice";
import { useSelector } from "react-redux";

interface Menu {
  id: string;
  label: string;
}

const mobileMenus: Menu[] = [
  { id: "/about", label: "About Us" },
  { id: "/contact", label: "Contact Us" },
  { id: "/careers", label: "Career" },
  { id: "/faqs", label: "FAQs" },
];

interface Props {
  setOpen: typeof setOpen;
  dispatch: AppDispatch;
  variant: "white" | "transparent";
}

export default function MobileMenu({ variant, dispatch }: Props) {
  const open = useSelector((state: RootState) => state.header.open);
  const [checkingOpen, setCheckingOpen] = useState(false);

  const closeMobileMenu = () => {
  setCheckingOpen(false);
  dispatch(setOpen(false));
};

  return (
    <div className="lg:hidden relative z-10 md:mt-0 mt-2">
      {open ? (
        <MdClose
          className={`md:text-[40px] text-[24px] relative z-60 ${
            variant === "white" ? "text-white" : "text-black"
          }`}
          onClick={() => dispatch(setOpen(false))}
        />
      ) : (
        <RiMenu3Fill
          className={`md:text-[40px] text-[24px] relative z-60 ${
            variant === "white" ? "text-white" : "text-black"
          }`}
          onClick={() => dispatch(setOpen(true))}
        />
      )}

      {open && (
        <div className="absolute right-0 top-[30px] z-50 mt-4 flex min-w-[320px] flex-col gap-5 rounded-lg bg-white p-6 shadow-xl md:top-10 md:min-w-[420px] animate-slide-down">
          <Link href="/" className="font-Euclid font-medium" onClick={closeMobileMenu}>
            Home
          </Link>

          <button
            type="button"
            onClick={() => setCheckingOpen(!checkingOpen)}
            className="flex w-full items-center justify-between font-Euclid font-medium text-black"
          >
            <span>Checking & Savings</span>
            <span>{checkingOpen ? "−" : "+"}</span>
          </button>

          {checkingOpen && (
            <div className="rounded-xl bg-gray-50 p-5">
              <div>
                <h4 className="font-Euclid font-semibold text-black">
                  Where to start
                </h4>

                <p className="mt-2 font-Euclid text-sm leading-6 text-gray-600">
                  Check out our rates, then get started with smarter, simpler
                  banking.
                </p>

                <Link
                  href="/open-account"
                  onClick={closeMobileMenu}
                  className="mt-4 inline-flex rounded-full bg-black px-5 py-3 font-Euclid text-sm font-medium text-white"
                >
                  Open Account
                </Link>
              </div>

              <div className="mt-6">
                <h4 className="font-Euclid font-semibold text-black">
                  What we offer
                </h4>

                <div className="mt-4 space-y-4">
                  <div>
                    <Link
                      href="/checking-savings/spending"
                      onClick={closeMobileMenu}
                      className="font-Euclid font-semibold text-black hover:text-yellow-500"
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
                      onClick={closeMobileMenu}
                      className="font-Euclid font-semibold text-black hover:text-yellow-500"
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
                      onClick={closeMobileMenu}
                      className="font-Euclid font-semibold text-black hover:text-yellow-500"
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
          )}

          {mobileMenus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.id}
              onClick={closeMobileMenu}
              className="font-Euclid font-medium"
            >
              {menu.label}
            </Link>
          ))}

          <Button variant="white" forceDarkText />
        </div>
      )}
    </div>
  );
}