'use client'
import Image from 'next/image';
// import FunFact from "../../../public/images/funfact_bg_1.svg";
// import FunFactTwo from "../../../public/images/funfact_bg_2.svg";
// import FunFactThree from "../../../public/images/funfact_bg_3.svg";
// import FunFactFour from "../../../public/images/funfact_bg_4.svg";
// import Shape from "../../../public/images/shape_line.svg";
// import Transaction from "../../../public/images/transactions_card_image.webp";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function ArchieveColumns() {
  const { ref, inView } = useInView({
         triggerOnce: true, // only trigger once
         threshold: 0.3, // % of component visible before triggering
       });

  return (
    <>
      <div className="flex lg:flex-row flex-col justify-center items-center w-full py-10 gap-10">
        {/* Left Column */}
        <div className="flex flex-col gap-10">
          <div className="relative flex items-center justify-center py-10 px-5 lg:h-[250px] md:h-[150px] xl:w-[360px] lg:w-[300px] w-full rounded-2xl shadow-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="/images/funfact_bg_1.svg"
              width={20}
              height={20}
              alt="card background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content */}
            <div ref={ref} className="relative flex flex-col items-start px-5">
              <h2 className="text-[#1c1c1e] xl:text-[50px] text-[35px] font-bold font-Euclid">
                {inView ? (
                  <CountUp end={80} duration={3} separator="," suffix="%" />
                ) : (
                  "0+"
                )}
              </h2>
              <p className="text-[#1c1c1e] text-[18px] font-medium font-Poppins">
                Users primarily access their accounts via mobile for convenient
                banking.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-10 px-5 lg:h-[250px] md:h-[150px] xl:w-[360px] lg:w-[300px] w-full rounded-2xl shadow-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="/images/funfact_bg_2.svg"
              width={20}
              height={20}
              alt="card background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content */}
            <div ref={ref} className="relative flex flex-col items-start px-5">
              <h2 className="text-[#1c1c1e] xl:text-[50px] text-[35px] font-bold font-Euclid">
                {inView ? (
                  <CountUp end={300} duration={3} separator="," suffix="K+" />
                ) : (
                  "0+"
                )}
              </h2>
              <p className="text-[#1c1c1e] text-[18px] font-medium font-Poppins">
                Gain access to a vast global network of over 300k+ partner ATMs
                located worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Center Image Section */}
        <div className="relative flex flex-col justify-start items-center bg-black xl:mx-5 px-5 xl:h-[500px] lg:h-[450px] md:h-[700px] h-[400px] w-full rounded-2xl shadow-xl overflow-hidden">
          {/* Shape image as background */}
          <Image
            src="/images/shape_line.svg"
            width={20}
            height={20}
            alt="shape"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Card image + button stacked on top */}
          <div className="relative flex flex-col items-center py-5">
            {/* Card image */}
           <Image
              src="/images/transactions_card_image.webp"
              width={700}
              height={450}
              alt="Transaction card preview"
              className="h-auto w-full max-w-[550px] rounded-xl shadow-lg md:max-w-[700px] lg:max-w-[250px] xl:max-w-[300px]"
              priority
            />

            {/* Button */}
            <button className="lg:px-6 lg:py-3 md:py-8 md:px-10 py-3 px-6 lg:mt-48 md:mt-24 mt-14 bg-yellow-400 font-bold font-Euclid text-[18px] text-black rounded-md shadow-md hover:bg-yellow-600">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-10">
          <div className="relative flex items-center justify-center py-10 px-5 lg:h-[250px] md:h-[150px] xl:w-[360px] lg:w-[300px] w-full rounded-2xl shadow-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="/images/funfact_bg_3.svg"
              width={20}
              height={20}
              alt="card background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content */}
            <div ref={ref} className="relative flex flex-col items-start px-5">
              <h2 className="text-[#1c1c1e] xl:text-[50px] text-[35px] font-bold font-Euclid">
                {inView ? (
                  <CountUp end={900} duration={3} separator="," suffix="K+" />
                ) : (
                  "0+"
                )}
              </h2>
              <p className="text-[#1c1c1e] text-[18px] font-medium font-Poppins">
                Wings quickly gained popularity among youth, attracting over
                990k+ customers in first year.
              </p>
            </div>
          </div>
          <div className="relative flex items-center justify-center py-10 px-5 lg:h-[250px] md:h-[150px] xl:w-[360px] lg:w-[300px] w-full rounded-2xl shadow-xl overflow-hidden">
            {/* Background Image */}
            <Image
              src="/images/funfact_bg_4.svg"
              width={20}
              height={20}
              alt="card background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content */}
            <div ref={ref} className="relative flex flex-col items-start px-5">
              <h2 className="text-[#1c1c1e] xl:text-[50px] text-[35px] font-bold font-Euclid">
                {inView ? (
                  <CountUp end={60} duration={3} separator="," suffix="%" />
                ) : (
                  "0+"
                )}
              </h2>
              <p className="text-[#1c1c1e] text-[18px] font-medium font-Poppins">
                Users enjoy 60% faster transaction processing times compared to
                traditional banks, providing them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
