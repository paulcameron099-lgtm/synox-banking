'use client'
import HeroShapes from '../hero/HeroShapes';
import HeroIcon from '../hero/HeroIcon';
import HeroImage from '../hero/HeroImage';
import HeroContent from '../hero/HeroContent';


export default function Hero() {

  return (
    <main className="relative flex flex-col justify-center w-full bg-zinc-950 overflow-hidden h-full min-h-screen">
      <div className="flex flex-col lg:flex-row w-full xl:h-[1150px] lg:h-[100px] md:h-[1200px] h-[1000px] min-h-screen">
        {/* Content Section */}
        <HeroContent />
        {/* Image Section */}
        <HeroImage />
        {/* Floating Icons */}
        <HeroIcon />
        {/* Hero Shape & Company Logos */}
        <HeroShapes />
      </div>
    </main>
  );
}
