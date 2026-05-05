import { motion } from "framer-motion";
import Image from "next/image";
import Star from "../star/Star";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Testimonial {
  images: string;
  name: string;
  role: string;
  desc: string;
}

const Testimonies: Testimonial[] = [
  {
    images: "/Images/test_image_2.webp",
    name: "Reynolds Anthony",
    role: "Our Client",
    desc: '"Switching to Synox online banking has been amazing. The seamless interface makes managing finances effortless. Whether tracking, paying bills, or transferring funds, Finto exceeds expectations. Highly recommended for anyone seeking a reliable banking solution."',
  },
  {
    images: "/Images/test_image_2.webp",
    name: "Reynolds Anthony",
    role: "Our Client",
    desc: '"Switching to Synox online banking has been amazing. The seamless interface makes managing finances effortless. Whether tracking, paying bills, or transferring funds, Finto exceeds expectations. Highly recommended for anyone seeking a reliable banking solution."',
  },
  {
    images: "/Images/test_image_2.webp",
    name: "Reynolds Anthony",
    role: "Our Client",
    desc: '"Switching to Synox online banking has been amazing. The seamless interface makes managing finances effortless. Whether tracking, paying bills, or transferring funds, Finto exceeds expectations. Highly recommended for anyone seeking a reliable banking solution."',
  },
];

export default function Testimonial() {

    const settings = {
      infinite: true,
      speed: 8000, // Speed of scrolling (ms)
      slidesToShow: 1, // Adjust based on layout
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
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    };

  return (
    <div className="flex lg:flex-row flex-col justify-center items-center lg:gap-5 gap-20 border md:-mt-60 border-yellow-400 xl:w-[70%] md:w-[80%] lg:w-[90%] w-[90%] rounded-2xl py-10 px-10 bg-[#1e1e1e]">
      <div className=" flex flex-col justify-start items-start lg:w-1/2 w-full gap-10">
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
          Testimonial
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
          className="font-Euclid font-bold xl:text-[40px] lg:text-[40px] text-start md:text-[45px] text-[30px] text-white"
        >
          What clients say about us
        </motion.p>
        <div className="flex md:flex-row flex-col justify-center items-center gap-8">
          <div className="flex flex-col gap-3">
            <Image
              src="/Images/client_logo_9.webp"
              alt="Testimonial pictures"
              width={50}
              height={50}
            />
            <Star />
          </div>
          <div className="flex flex-col gap-3">
            <Image
              src="/Images/client_logo_10.webp"
              alt="Testimonial pictures"
              width={50}
              height={50}
            />
            <Star />
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full">
        <Slider {...settings} className="w-full">
          {Testimonies.map((tes, i) => (
            <div key={i} className="flex flex-col gap-5">
              <div className="flex flex-row justify-start items-start gap-3">
                <Image
                  src={tes.images}
                  alt="Testimonial images"
                  className=" rounded-full"
                  width={60}
                  height={60}
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-white text-[16px] font-medium font-Poppins">
                    {tes.name}
                  </h2>
                  <p className="text-white text-[14px] font-medium font-Poppins">
                    {tes.role}
                  </p>
                </div>
              </div>
              <p className="text-white text-[18px] font-medium font-Poppins mt-5">
                {tes.desc}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
