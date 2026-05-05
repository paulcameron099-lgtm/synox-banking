import { PiStarFourFill, PiStarFourBold } from "react-icons/pi";

export default function HeroIcon() {
  return (
    <>
       {/* Floating Icons */}
              <span className="absolute right-10 top-56 text-[30px] text-[#d9ff43] slow-spin">
                <PiStarFourFill />
              </span>
              <span className="absolute left-10 top-132 text-[30px] text-[#d9ff43] slow-spin">
                <PiStarFourBold />
              </span>
    </>
  )
}
