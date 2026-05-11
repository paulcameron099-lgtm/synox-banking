import Link from 'next/link';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function Footer() {
  return (
    <footer>
      <div
        className="flex flex-col justify-center items-center w-full bg-cover bg-center bg-no-repeat mt-20"
        style={{ backgroundImage: "url('/Images/hero_pattern.s')" }}
      >
        <div className="flex flex-col lg:justify-center justify-start items-start lg:items-center w-full py-10 px-10 bg-zinc-950 border border-yellow-500 rounded-2xl">
          <div className="flex lg:flex-row flex-col lg:justify-center justify-start lg:items-center items-start xl:gap-20 gap-16">
            <div className="flex flex-row items-center gap-5">
              <MdOutlineMarkEmailRead className="text-white text-[45px] bg-[#ffffff1a] rounded-full px-3 py-3" />
              <div className="flex flex-col justify-start items-start gap-2">
                <h3 className="text-white font-medium font-Poppins text-[14px]">
                  Write to us
                </h3>
                <p className="text-white font-medium font-Poppins xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px]">
                  office@synox.com
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <LuPhoneCall className="text-white text-[45px] bg-[#ffffff1a] rounded-full px-3 py-3" />
              <div className="flex flex-col justify-start items-start gap-2">
                <h3 className="text-white font-medium font-Poppins text-[14px]">
                  Call Us (USA)
                </h3>
                <p className="text-white font-medium font-Poppins xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px]">
                  +(1) 1230 452 8597
                </p>
              </div>
            </div>
            {/* <div className="flex flex-row items-center gap-5">
              <HiOutlineLocationMarker className="text-white text-[45px] bg-[#ffffff1a] rounded-full px-3 py-3" />
              <div className="flex flex-col justify-start items-start gap-2">
                <h3 className="text-white font-medium font-Poppins text-[14px]">
                  Our Office
                </h3>
                <p className="text-white font-medium font-Poppins xl:text-[20px] lg:text-[18px] md:text-[16px] text-[14px]">
                  Indiana, Indianapolis, USA
                </p>
              </div>
            </div> */}
          </div>
          <hr className="bg-white/30 w-full h-px mx-auto mt-[70px] mb-0 border-0" />
          <div className="flex lg:flex-row flex-col lg:justify-center justify-start lg:items-center items-start xl:gap-48 lg:gap-40 gap-20 py-10">
            <div className='flex md:flex-row flex-col items-center gap-24'>
            <div className="flex md:flex-row flex-col gap-5">
              {/* <h3 className="text-white font-medium font-Poppins text-[16px]">
                Products
              </h3> */}
              <Link
                href="/"
                className="font-medium font-Popppins text-[20px] text-white hover:text-yellow-500 hover:underline"
              >
                Cards shorts
              </Link>
              <Link
                href="/"
                className="font-medium font-Popppins text-[20px] text-white hover:text-yellow-500 hover:underline"
              >
                Deposits
              </Link>
              <Link
                href="/"
                className="font-medium font-Popppins text-[20px] text-white hover:text-yellow-500 hover:underline"
              >
                Transfers
              </Link>
            </div>
            </div>
            
          </div>
          <hr className="bg-white/30 w-full h-px mx-auto mt-[70px] mb-0 border-0" />
          <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center py-10 lg:gap-40 gap-10">
            {/* Left side - copyright */}
            <p className="text-white font-medium font-Poppins text-[16px]">
              Copyright © 2026 Synox, All rights reserved.
            </p>

            {/* Right side - terms & privacy */}
            <div className="flex md:flex-row flex-col md:items-center items-start gap-6">
              <Link
                href="/terms-and-conditions"
                className="font-medium font-Poppins text-[16px] text-white hover:text-yellow-500 hover:underline"
              >
                Terms & Conditions
              </Link>

              {/* vertical divider */}
              <span className="h-6 w-px bg-white/30 md:flex hidden"></span>

              <Link
                href="/privacy"
                className="font-medium font-Poppins text-[16px] text-white hover:text-yellow-500 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
