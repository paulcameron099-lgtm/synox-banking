'use client'
import { motion } from "framer-motion";
import Image from 'next/image';
import HeroHand from "../../../public/images/hero_hand_image.png";
import HeroCard from "../../../public/images/card.png";
export default function HeroImage() {
  return (
    <>
      {/* Image Section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          delay: 0.2,
          x: { type: "spring", stiffness: 60 },
          opacity: { duration: 1 },
          ease: "easeIn",
          duration: 1.2,
        }}
        viewport={{ once: true }}
        className="w-1/2 relative lg:flex hidden mt-40 overflow-hidden"
      >
        <Image
          src={HeroHand}
          alt="hero_hand_image"
          className="xl:w-[600px] lg:w-[450px] absolute xl:mt-72 mt-68 right-0 z-10"
        />
        <Image
          src={HeroCard}
          alt="card_image"
          className="xl:w-[400px] lg:w-[300px] md:w-[320px] z-10 xl:mt-24 lg:mt-32 md:mt-24 lg:right-52 xl:right-68 absolute slow-bounce"
        />
      </motion.div>
    </>
  );
}
