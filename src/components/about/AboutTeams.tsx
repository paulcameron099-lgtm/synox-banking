'use client'
import Image from 'next/image';
import AboutOne from "../../../public/images/about_image_1.webp";
import AboutTwo from "../../../public/images/about_image_2.webp";
import AboutThree from "../../../public/images/about_image_3.webp";
import Aboutfour from "../../../public/images/avatar_image_4.webp";
import Aboutfive from "../../../public/images/avatar_image_5.webp";
import Aboutsix from "../../../public/images/avatar_image_6.webp";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";


export default function AboutTeams() {
  const { ref, inView } = useInView({
       triggerOnce: true, // only trigger once
       threshold: 0.3, // % of component visible before triggering
     });
  return (
    <>
      <div className="flex flex-col lg:w-1/2 w-full justify-center items-center gap-4">
        {/*first two image*/}
        <div className="flex flex-row justify-center items-center gap-4">
          <Image
            src={AboutOne}
            alt="about_image"
            className="md:w-48 w-36 rounded-xl mt-16 slow-bounce"
          />
          <Image
            src={AboutTwo}
            alt="about_image"
            className="md:w-48 w-36 rounded-xl slow-bounce"
          />
          <Image
            src={AboutThree}
            alt="about_image"
            className="md:w-48 w-36 mt-16 rounded-xl lg:hidden md:flex hidden"
          />
        </div>
        {/*second three image*/}
        <div className="flex flex-row lg:ml-[13rem] md:-ml-3 ml-[10rem] md:-mt-5">
          <Image
            src={Aboutfour}
            alt="avatar_image"
            className="w-12 rounded-full border-2 border-white"
          />
          <Image
            src={Aboutfive}
            alt="avatar_image"
            className="w-12 rounded-full border-2 border-white -ml-4"
          />
          <Image
            src={Aboutsix}
            alt="avatar_image"
            className="w-12 rounded-full border-2 border-white -ml-4"
          />
          <p
            ref={ref}
            className="text-white font-roboto font-bold flex justify-center
           items-center md:w-12 w-[3.5rem] bg-black border-2 border-white -ml-4 rounded-full h-12"
          >
            {inView ? (
              <CountUp end={9} duration={3} suffix="K+" separator="," />
            ) : (
              "0+"
            )}
          </p>
        </div>
        {/*last image*/}
        <Image
          src={AboutThree}
          alt="about_image"
          className="md:w-48 w-36 rounded-xl lg:flex md:hidden flex slow-bounce"
        />
      </div>
    </>
  );
}
