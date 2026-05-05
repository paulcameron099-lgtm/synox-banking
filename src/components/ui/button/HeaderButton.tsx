import React from 'react'
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useSelector} from 'react-redux';
import { RootState } from "@/redux/store";

interface Prop {
  variant: "white" | "transparent"
}

export default function HeaderButton({variant}: Prop) {
  const test = useSelector((state: RootState) => state.header.test);

  return (
    <div className="flex items-center gap-4">
      {/*login button*/}
      <div
        className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
          test ? "border border-black" : "border border-gray-800"
        }`}
      >
        <FaUser
          className={`md:text-[15px] text-[10px] relative z-10 ${
            variant === "white"
              ? "group-hover:text-white"
              : "group-hover:text-black"
          } transition-colors duration-500 ${
            test ? "text-balck" : "text-yellow-500"
          }`}
        />
        <Link
          href="/login"
          className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 ${
            variant === "white"
              ? "group-hover:text-white"
              : "group-hover:text-black"
          } transition-colors duration-500
                ${test ? "text-black" : "text-white"}`}
        >
          Login
        </Link>
        <span
          className={`absolute inset-0 ${
            variant === "white" ? "bg-black" : "bg-white"
          } translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out`}
        ></span>
      </div>
      <div
        className={`relative flex items-center gap-2 md:px-5 px-3 py-2 overflow-hidden group ${
          test ? "border border-black" : "border border-gray-800"
        }`}
      >
        <FaUser
          className={`md:text-[15px] text-[10px] relative z-10 ${
            variant === "white"
              ? "group-hover:text-white"
              : "group-hover:text-black"
          } transition-colors duration-500 ${
            test ? "text-balck" : "text-yellow-500"
          }`}
        />
        <Link
          href="/register"
          className={`font-Euclid font-medium md:text-[15px] text-[10px] relative z-10 ${
            variant === "white"
              ? "group-hover:text-white"
              : "group-hover:text-black"
          } transition-colors duration-500
                ${test ? "text-black" : "text-white"}`}
        >
          Register
        </Link>
        <span
          className={`absolute inset-0 ${
            variant === "white" ? "bg-black" : "bg-white"
          } translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out`}
        ></span>
      </div>
    </div>
  );
}
