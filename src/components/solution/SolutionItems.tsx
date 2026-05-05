import React from 'react'
import WalletIcon from "@/icons/WalletIcon";
import IconChart from "@/icons/IconChart";
import IconGlobal from "@/icons/IconGlobal";
import IconSwatc from "@/icons/IconSwatc";
import IconBitcoin from "@/icons/IconBitcoin";
import { JSX } from 'react';
import Image from 'next/image';

interface Solution {
  image: JSX.Element;
  title: string;
  desc: string;
  img: string;
  bottom: string;
  top: string;
  BgColor: string;
}

const solutions: Solution[] = [
  {
    image: <WalletIcon />,
    title: "Receive Early Payments Within 24 Hours",
    desc: "Experience the convenience of early payments arriving within just 24 hours. Say goodbye.",
    img: "/images/ob_feature_image_1.webp",
    bottom: "xl:-mb-10 lg:-mb-10 md:-mb-40 -mb-10",
    top: "xl:mt-20 lg:mt-24 mt-7",
    BgColor: "bg-[rgb(247,255,217)]",
  },
  {
    image: <IconChart />,
    title: "Monitor Your Essential Expenses Wisely",
    desc: "Take control of your financial journey by wisely monitoring your essential expenses.",
    img: "/images/ob_feature_image_2.webp",
    bottom: "",
    top: "md:mt-20 mt-7",
    BgColor: "bg-[rgb(229,255,223)]",
  },
  {
    image: <IconGlobal />,
    title: "Send Money Anywhere, Anytime to here",
    desc: "Send money to any destination, anytime, and from anywhere.",
    img: "/images/ob_feature_image_3.webp",
    bottom: "",
    top: "md:mt-20 mt-2",
    BgColor: "bg-[rgb(255,233,212)]",
  },
  {
    image: <IconSwatc />,
    title: "Virtual or physical - it’s your choice",
    desc: "Choice the convenience of virtual options the choice is yours.",
    img: "/images/ob_feature_image_4.webp",
    bottom: "-mb-10",
    top: "md:mt-40 mt-7",
    BgColor: "bg-[rgb(239,246,255)]",
  },
  {
    image: <IconBitcoin />,
    title: "B2B & Cryptocurrency Payment System",
    desc: "Streamline B2B payments with cryptocurrency integration.",
    img: "/images/ob_feature_image_5.webp",
    bottom: "",
    top: "mt-10",
    BgColor: "bg-[rgb(221,253,237)]",
  },
];

export default function SolutionItems() {
  return (
    <div className="w-full flex flex-wrap gap-6 justify-center mt-10">
      {solutions.map(({ image, title, desc, img, top, bottom, BgColor }, i) => (
        <div
          key={i}
          className={`flex flex-col ${
            i < 2 ? "w-full md:w-[40%]" : " w-full lg:w-[26%] md:w-[40%]"
          } ${BgColor} rounded-3xl gap-4 px-10 py-10 min-h-[300px] ${
            i === solutions.length - 1 ? "lg:mr-0 md:mr-[300px] mr-0" : ""
          }`}
        >
          <span className="w-16 p-4 bg-white rounded-full shadow-lg flex justify-center items-center">
            {image}
          </span>
          <h2 className="font-Euclid font-bold lg:text-[30px] md:text-[20px] text-[20px] text-[#1c1c1e]">
            {title}
          </h2>
          <p className="font-Poppins font-medium md:text-[18px] text-[15px] text-[#656565]">
            {desc}
          </p>
          <Image
            src={img}
            width={600}
            height={400}
            alt="solution_image"
            className={`w-[600%] ${top} ${bottom}`}
          />
        </div>
      ))}
    </div>
  );
}
