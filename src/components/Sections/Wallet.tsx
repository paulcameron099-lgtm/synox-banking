"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/logo/herowhite";
import Image from "next/image";
import Integrated from '../../../public/images/integrated_logo_1.webp'
import IntegratedTwo from '../../../public/images/integrated_logo_2.webp'
import IntegratedThree from '../../../public/images/integrated_logo_3.webp'
import IntegratedFour from '../../../public/images/integrated_logo_4.webp'
import IntegratedFive from '../../../public/images/integrated_logo_5.webp'
import IntegratedSix from '../../../public/images/integrated_logo_6.webp'
import IntegratedSeven from '../../../public/images/integrated_logo_7.webp'
import IntegratedEight from '../../../public/images/integrated_logo_8.webp'
import IntegratedNine from '../../../public/images/integrated_logo_9.webp'
import IntegratedTen from '../../../public/images/integrated_logo_10.webp'

export default function Wallet() {
  return (
    <div className="py-20">
      <div className="flex flex-col justify-center items-center gap-5 py-20">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 60,
            duration: 1.2,
          }}
          viewport={{ once: true }}
          className="text-[14px] font-Poppins font-bold text-black bg-gray-400 bg-opacity-30 px-3 py-1 rounded-md uppercase"
        >
          integrated
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 60,
            duration: 1.2,
          }}
          viewport={{ once: true }}
          className="text-black font-Euclid font-bold xl:text-[50px] lg:text-[40px] lg:text-start text-center md:text-[60px] text-[30px] px-5"
        >
          Mobile wallet integrations
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-5">
        {/* LEFT column (stacked on mobile, aligned left on md+) */}
        <div className="w-full md:w-auto flex flex-col justify-center items-center gap-6">
          {/* Row 1: primary two images (centered on mobile) + mobile-only extras */}
          <div className="w-full flex flex-row justify-center md:justify-start items-center gap-4 md:gap-20 lg:gap-36">
            <div className="flex items-center gap-4 md:gap-20 lg:gap-36">
              <Image
                src={Integrated}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedTwo}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
            </div>

            {/* mobile-only extras (hidden on md+) */}
            <div className="flex items-center gap-4 md:hidden">
              <Image
                src={IntegratedSix}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedSeven}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedThree}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
            </div>
          </div>

          <div className="bg-black py-7 px-7 rounded-lg mx-auto md:mx-0 md:hidden flex">
            <Link href="/" className="mt-2">
              <Logo />
            </Link>
          </div>

          {/* Desktop-only center image (hidden on mobile) */}
          <div className="hidden md:flex justify-center items-center">
            <Image
              src={IntegratedThree}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>

          {/* Row 2: second set (centered on mobile) + mobile-only extras */}
          <div className="w-full flex flex-row justify-center md:justify-start items-center gap-4 md:gap-20 lg:gap-36">
            <div className="flex items-center gap-4 md:gap-20 lg:gap-36">
              <Image
                src={IntegratedFour}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedFive}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <Image
                src={IntegratedNine}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedTen}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
              <Image
                src={IntegratedEight}
                alt="wallet_image"
                width={64}
                height={64}
                className="md:w-16 w-12 h-16"
              />
            </div>
          </div>
        </div>

        {/* CENTER logo (when stacked on mobile it's centered with mx-auto) */}
        <div className="bg-black py-7 px-7 rounded-lg mx-auto md:mx-0 md:flex hidden">
          <Link href="/" className="mt-2">
            <Logo />
          </Link>
        </div>

        {/* RIGHT column (desktop-only content hidden on mobile) */}
        <div className="w-full md:w-auto flex flex-col justify-center items-center gap-6">
          <div className="hidden md:flex flex-row justify-center items-center gap-4 md:gap-20 lg:gap-36">
            <Image
              src={IntegratedSix}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            <Image
              src={IntegratedSeven}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>

          <div className="hidden md:flex justify-center items-center">
            <Image
              src={IntegratedEight}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>

          <div className="hidden md:flex flex-row justify-center items-center gap-4 md:gap-20 lg:gap-36">
            <Image
              src={IntegratedNine}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
            <Image
              src={IntegratedTen}
              alt="wallet_image"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
