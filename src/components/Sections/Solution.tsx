import SolutionItems from '../solution/SolutionItems';




export default function Solution() {
  return (
    <div className="w-full lg:px-0 px-7" id='service'>
      <div className="flex flex-col justify-center items-center mt-32 gap-4 text-center">
        <h2 className="bg-[#1c1c1e1a] text-[#1c1c1e] px-3 py-2 font-Euclid font-medium uppercase rounded-md w-36 text-[15px]">
          Core features
        </h2>
        <p className="font-Euclid font-bold md:text-[50px] text-[25px] xl:w-[50%] w-full text-[#1c1c1e]">
          5 Rapid Highlights of Our Synox Solution
        </p>
      </div>
      <SolutionItems />
    </div>
  );
}
