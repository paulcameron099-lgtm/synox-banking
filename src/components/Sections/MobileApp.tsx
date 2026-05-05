'use client'
import Image from 'next/image'
import Mobile from '../../../public/images/mobile_app_image.webp';
import { motion } from "framer-motion";
import Link from 'next/link';
import { FaApple } from "react-icons/fa";
import { MdOutlineAndroid } from "react-icons/md";
import { FaFire } from "react-icons/fa6";

export default function MobileApp() {
  return (
    <div
      className="w-full bg-cover bg-center py-10 bg-no-repeat flex items-center justify-center md:mt-20 mt-10"
      style={{ backgroundImage: "url('/Images/app_store_bg_1.webp')" }}
    >
      {/*Download content*/}
      <div className="flex lg:flex-row flex-col justify-center items-center gap-28 max-w-6xl">
        <div className="lg:w-1/2 w-full flex justify-center lg:order-1 order-2 -mb-10 lg:-mb-[108px]">
          <Image
            src={Mobile}
            alt="mobile-app"
            className="lg:w-[550px] md:w-[750px] w-[350px]"
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-5 lg:w-1/2 w-full lg:order-2 order-1 md:px-20 px-10 lg:px-0">
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
            className="flex flex-row items-center gap-1 text-[14px] font-Poppins font-medium text-[#1e1e1e] bg-[#1c1c1e1a] bg-opacity-30 px-3 py-1 rounded-md uppercase"
          >
            <FaFire />
            Mobile App 2.0 NEW
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
            className="text-[#1e1e1e] font-Euclid font-bold xl:text-[48px] lg:text-[40px] md:text-[60px] text-[30px] lg:w-[70%] w-full"
          >
            Download and enjoy the experience
          </motion.p>
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
            className="text-black font-Poppins font-medium xl:text-[18px] md:text-[15px] text-[12px] lg:w-[80%] w-full"
          >
            Don&apos;t miss out! Download now for seamless functionalities and
            endless possibilities.
          </motion.p>
          <div className="flex items-center gap-4 justify-between md:mt-0 mt-5">
            {/*work with us & get a quote button*/}
            <div className="relative flex items-center bg-black gap-2 md:px-10 px-3 py-2 overflow-hidden group border border-black hover:border-white rounded-full ">
              <Link
                href="/apple"
                className="flex flex-row items-center gap-1 font-Euclid font-medium md:text-[14px] text-[10px] relative z-10 group-hover:text-black text-white transition-colors duration-500"
              >
                <FaApple />
                Apple iOS
              </Link>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
            <div className="relative flex items-center gap-2 md:px-10 px-3 py-2 bg-black overflow-hidden group border border-black hover:border-white rounded-full ">
              <Link
                href="/android"
                className="flex flex-row items-center gap-1 font-Euclid font-medium md:text-[14px] text-[10px] relative z-10 group-hover:text-black transition-colors duration-500 text-white"
              >
                <MdOutlineAndroid />
                Android
              </Link>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out "></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
