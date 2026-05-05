import React from 'react'
import Image from 'next/image';
import AboutVideoOne from "../../../public/Images/about_video_image_1.webp";

export default function AboutVideo() {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-40 gap-4">
        <h2 className="bg-[#1c1c1e1a] flex justify-center items-center text-[#1c1c1e] px-3 py-2 font-Euclid font-medium uppercase rounded-md w-32 text-[12px]">
          meet our new
        </h2>
        <h3 className="font-Euclid font-bold md:text-[50px] text-[20px] text-[#1c1c1e]">
          Physical Card for Your Pocket
        </h3>
        <Image
          src={AboutVideoOne}
          alt="image_video"
          className="rounded-2xl"
        />
      </div>
    </>
  );
}
