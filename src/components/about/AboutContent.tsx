'use client'
import React from 'react'
import IconDollar from "@/icons/IconDollar";
import IconMax from "@/icons/IconMax";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function AboutContent() {
   const { ref, inView } = useInView({
     triggerOnce: true, // only trigger once
     threshold: 0.3, // % of component visible before triggering
   });


  return (
    <div className="flex flex-col justify-start items-start lg:w-1/2 w-full lg:gap-4 md:gap-7 gap-5">
      <h2 className="bg-[#1c1c1e1a] text-[#1c1c1e] flex justify-center items-center px-3 py-2 font-Euclid font-medium uppercase rounded-md w-28 text-[12px]">
        Who we are
      </h2>
      <h3 className="font-Euclid font-bold md:text-[50px] text-[25px] lg:w-[80%] md:w-[80%] w-full text-[#1c1c1e] md:leading-[3.7rem]">
        Shaping Your Future with Online Banking
      </h3>
      <p className="font-Poppins font-medium text-[#656565] text-[20px] lg:w-[80%] w-full">
        Embark on a journey towards a brighter financial future with our online
        banking services. From managing accounts to convenient bill payments,
        our platform is designed to empower.
      </p>
      <div className="flex md:flex-row flex-col justify-start items-start w-full lg:gap-4 md:gap-[10rem] gap-6 mt-5">
        <div className="flex flex-row gap-4 items-start">
          {/*Icon image*/}
          <span className="bg-[#1c1c1e] px-5 py-5 rounded-lg flex justify-center items-center self-start">
            <IconMax />
          </span>
          {/*Icon content*/}
          <div ref={ref} className="flex flex-col md:-mt-3 md:-space-y-2">
            <h2 className="font-Euclid font-bold text-[#1c1c1e] md:text-[40px] text-[30px]">
              {inView ? (
                <CountUp end={9} duration={3} separator="," suffix="M+" />
              ) : (
                "0+"
              )}
            </h2>
            <p className="font-Poppins font-medium text-[#656565] text-[18px] xl:w-1/2 leading-5">
              Daily Transactions
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-start">
          <span className="bg-[#1c1c1e] px-5 py-5 rounded-lg flex justify-center items-center self-start">
            <IconDollar />
          </span>
          <div ref={ref} className="flex flex-col md:-mt-3 md:-space-y-2">
            <h2 className="font-Euclid font-bold text-[#1c1c1e] md:text-[40px] text-[30px]">
              {inView ? (
                <CountUp end={9} duration={3} separator="," suffix='%+' />
              ) : (
                "0+"
              )}
            </h2>
            <p className="font-Poppins font-medium text-[#656565] text-[18px] xl:w-1/2 leading-5">
              Unlimited Cashback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
