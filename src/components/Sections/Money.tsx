"use client";
import { motion } from "framer-motion";
import Moneycontent from "../money/Moneycontent";
import Testimonial from "./Testimonial";

export default function Money() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <div className=" bg-black w-full xl:h-[160vh] lg:h-screen">
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
          className="text-[14px] font-Poppins font-bold text-[#d9ff43] bg-[#d9ff431a] bg-opacity-30 px-3 py-1 rounded-md uppercase"
        >
          card
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
          className="font-Euclid font-bold xl:text-[50px] lg:text-[40px] lg:text-start text-center md:text-[60px] text-[30px] px-5 text-white"
        >
          Take control of your Money.
        </motion.p>
        <Moneycontent />
        </div>
      </div>
      <Testimonial />
    </div>
  );
}
