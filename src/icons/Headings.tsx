import React from 'react'

interface SubtitleProps {
    title: string;
    desc: string;
    width:string;
}

const headings: SubtitleProps[] = [
  {
    title: "Core features",
    desc: "5 Rapid Highlights of Our Synox Solution",
    width:"xl:w-[60%]"
  },
];

export default function Headings({title, desc, width } : SubtitleProps) {
  return (
    <div className='w-full  '>
        {/*if props are provided, use them */}
        {title && desc ? (
            <div>
            <h2 className='bg-gray-300 px-3 py-2 font-roboto font-medium uppercase rounded-md w-36'>{title}</h2>
            <p className={`font-roboto font-bold text-[40px] ${width}`}>{desc}</p>
            </div>
        ): (
        headings.map(({title, desc}, i) => (
            <div key={i}>
            <h2 className='bg-gray-300 px-3 py-2 font-roboto font-medium uppercase rounded-md w-36'>{title}</h2>
            <p className='font-roboto font-bold text-[40px] xl:w-[60%]'>{desc}</p>
            </div>
        ))
        )}
       
      
    </div>
  )
}
