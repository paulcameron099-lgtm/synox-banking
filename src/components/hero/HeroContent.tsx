'use client'
import { motion } from "framer-motion";
import Star from '../star/Star';

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col lg:justify-start md:justify-center lg:items-start items-center gap-4 md:px-20 md:py-60 py-40 lg:w-1/2 md:w-full">
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
        className="text-[14px] font-Poppins font-bold text-[#d9ff43] bg-[#d9ff431a] bg-opacity-30 px-3 py-1 rounded-md"
      >
        All-In-One Banking For Everyone
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
        className="font-Euclid font-bold xl:text-[50px] lg:text-[40px] lg:text-start text-center md:text-[60px] text-[40px] text-white"
      >
        The Premier Finto Online Banking
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
        className="font-Euclid font-medium text-white xl:text-[18px] lg:px-0 px-5 lg:text-[15px] md:text-[20px] text-[13px] lg:text-start text-center"
      >
        Discover online banking with Synox. Experience unmatched security and
        efficiency for managing your finances.
      </motion.p>
      <div className="flex md:flex-row flex-col md:justify-center lg:justify-start items-center gap-6 lg:mt-14 mt-10 w-full">
        {/* Button Wrapper */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 60,
            duration: 1.4,
          }}
          viewport={{ once: true }}
          className="bg-[#d9ff43] xl:px-10 lg:px-2 px-3 py-5 rounded-lg"
        >
          <button className="text-black font-Euclid font-bold xl:text-[20px] lg:text-[15px]">
            Get Started Free Now
          </button>
        </motion.div>

        {/* Review Section */}
        <Star />
      </div>
    </div>
  );
}
