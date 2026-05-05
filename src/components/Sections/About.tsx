import AboutContent from '../about/AboutContent';
import AboutTeams from '../about/AboutTeams';
import AboutVideo from '../about/AboutVideo';


export default function About() {
  return (
    <main className="bg-gray-100 flex flex-col w-full md:mt-36 mt-28 py-28 lg:px-20 px-10" id='about'>
      <div className="flex justify-center items-center lg:flex-row flex-col w-full">
        <AboutContent />
        <AboutTeams />
      </div>
     <AboutVideo />
    </main>
  );
}
