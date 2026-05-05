import About from "@/components/Sections/About";
import Achievement from "@/components/Sections/Achievement";
import Hero from "@/components/Sections/Hero";
import MobileApp from "@/components/Sections/MobileApp";
import Money from "@/components/Sections/Money";
import Solution from "@/components/Sections/Solution";
import Testimonial from "@/components/Sections/Testimonial";
import Wallet from "@/components/Sections/Wallet";

export default function Home() {
  return (
    <div>
      <Hero />
      <Solution />
      <About />
      <Achievement />
      <Money />
      <Wallet />
      <MobileApp />
    </div>
  )
}
