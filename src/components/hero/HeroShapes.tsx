'use client'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import Hero_shape from '@/components/ui/logo/HeroShape';
import Image from 'next/image';

interface company {
  image: string;
  image_size: string;
}
 const companies: company[]  = [
    { image: "/images/client_logo_2.webp", image_size: "w-28" }, //kemper
    { image: "/images/client_logo_3.webp", image_size: "w-28" },//meetlife
    { image: "/images/client_logo_4.webp", image_size: "w-28" },// protective
    { image: "/images/client_logo_5.webp", image_size: "w-24" }, // hellmer
    { image: "/images/client_logo_6.webp", image_size: "w-28" }, // baloise
    { image: "/images/client_logo_7.webp", image_size: "w-20" }, //affirm
    { image: "/images/client_logo_8.webp", image_size: "w-[6.5rem]" },//airbnb
  ];

export default function HeroShapes() {

    const settings = {
      infinite: true,
      speed: 5000, // Speed of scrolling (ms)
      slidesToShow: 5, // Adjust based on layout
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0, // No delay between slides
      cssEase: "linear", // Smooth scrolling
      pauseOnHover: false,
      arrows: false, // Hide arrows for a clean look
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };

  return (
    <>
     {/* Hero Shape & Company Logos */}
            <div className="w-full overflow-hidden absolute lg:top-140 xl:top-152 md:top-184 top-156">
              <Hero_shape />
              <div className="md:px-20 flex flex-col lg:justify-start md:justify-center lg:items-start items-center lg:mt-0 md:mt-16 mt-10 gap-14">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 60,
                    duration: 1.4,
                  }}
                  viewport={{ once: true }}
                  className="uppercase text-[14px] font-Euclid font-medium text-[#d9ff43] bg-[#d9ff431a] bg-opacity-30 px-3 py-1 rounded-md lg:w-60 md:w-56 text-center"
                >
                  Some Several Companies
                </motion.h1>
                <div className="overflow-hidden w-full">
                  <Slider {...settings} className="w-full">
                    {companies.map(({ image, image_size }, i) => (
                      <div
                        key={i}
                        className="flex justify-center items-center flex-row gap-2"
                      >
                        <ul className="border border-gray-800 p-5 rounded-full xl:w-52 lg:w-60 md:w-48 w-40">
                          <li className="text-white text-center text-[30px] flex items-center justify-center">
                            <Image
                              src={image}
                              alt="image_logo"
                              className={`${image_size}`}
                              width={208}
                              height={100}
                            />
                          </li>
                        </ul>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
    </> 
  )
}
