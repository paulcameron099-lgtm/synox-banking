"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Hero_blackLogo from "@/components/ui/logo/hero";
import Logo from "@/components/ui/logo/herowhite";
import { useSelector } from "react-redux";
import {
  setScrolling,
  setOpen,
  setTest,
  setOpenScrolledMenu,
} from "@/redux/HeaderSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import Button from "@/components/ui/button/HeaderButton";
import MobileMenu from "./MobileMenu";
import Menu from "./Menu";


export default function Header() {
  const dispatch = useAppDispatch();
  const { scrolling, test, open, openScrolledMenu } = useSelector(
    (state: RootState) => state.header
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        dispatch(setScrolling(true));
        dispatch(setTest(true));
      } else {
        dispatch(setScrolling(false));
        dispatch(setTest(false));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  return (
    <header>
      {/* Transparent Header - Before Scroll */}
      <div
        className={`fixed w-full top-0 z-30 lg:h-24 h-22 bg-zinc-950 shadow-lg transition-all duration-500 ease-in-out ${
         scrolling
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="flex justify-between py-7 md:px-20 px-10 bg-transparent">
          <Link href="/" className="mt-2">
            <Logo />
          </Link>
          <Menu variant="white"/>
          <div className="lg:flex items-center gap-4 md:mt-0 mt-2 hidden">
            <Button variant="transparent"/>
          </div>

          <MobileMenu
            setOpen={setOpen}
            dispatch={dispatch}
            variant="white"
          />
        </div>
      </div>

      {/* White Header - Slides In on Scroll */}
      <div
        className={`fixed w-full top-0 z-30 lg:h-20 h-18 bg-white shadow-lg transition-transform duration-500 ease-in-out ${
          scrolling
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between lg:py-5 md:py-4 py-5 md:px-20 px-10">
          <Link href="/" className="mt-2">
            <Hero_blackLogo />
          </Link>
          <Menu variant="transparent"/>
          {/*login button*/}
          <div className="lg:flex items-center gap-4 md:mt-0 mt-2 hidden">
            <Button variant="white"/>
          </div>
          <MobileMenu
            setOpen={setOpen}
            dispatch={dispatch}
            variant="transparent"
          />
        </div>
      </div>
    </header>
  );
}
