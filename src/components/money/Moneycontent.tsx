import Image from 'next/image';


interface Money {
    number: string;
    image: string;
    title: string;
    desc: string;
}

const monies: Money[] = [
  {
    number: "/01",
    image: "/images/icon_pen.svg",
    title: "Register and Create Your Account",
    desc: "Start your journey by registering for an account and effortlessly creating it.",
  },
  {
    number: "/02",
    image: "/images/icon_web_design.svg",
    title: "Effortlessly Manage Your Virtual Cards",
    desc: "Easily manage your virtual cards with our platform. Customize, track, and stay secure.",
  },
  {
    number: "/03",
    image: "/images/icon_pen.svg",
    title: "ATM Withdrawals and Online Banking",
    desc: "Easily withdraw cash from ATMs and conveniently manage your banking needs online.",
  },
];

export default function Moneycontent() {

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 justify-center items-stretch rounded-2xl xl:w-[70%] md:w-[80%] lg:w-[90%] w-[90%] border border-yellow-400">
      {monies.map((moni, i) => (
        <div
          key={i}
          className="flex flex-col justify-center items-center gap-5 py-10 px-5 h-[400px] border-b md:border-b-0 border-yellow-400 border-r bg-[#1e1e1e]"
        >
          <span className="text-white font-medium font-Euclid text-[20px]">
            {moni.number}
          </span>
          <Image
            src={moni.image}
            alt="withdraw options"
            className="w-14"
            width="14"
            height="10"
          />
          <p className="text-white font-bol font-Euclid text-[20px] text-center">
            {moni.title}
          </p>
          <p className="text-white font-medium font-Poppins text-[13px] text-center">
            {moni.desc}
          </p>
        </div>
      ))}
      <div className="flex flex-col py-8 px-5 h-[403px] bg-yellow-400 xl:rounded-r-2xl rounded-b-2xl md:rounded-br-2xl md:rounded-bl-none">
        <div className="flex flex-col justify-center items-center text-center gap-10">
          <h2 className="text-black font-bold font-Euclid text-[24px]">
            The Start of Today Begins Now
          </h2>
          <p className="text-black font-medium font-Poppins text-[20px]">
            Today marks the inception of a new journey, starting at this very
            moment.
          </p>
        </div>
      </div>
    </div>
  );
}
