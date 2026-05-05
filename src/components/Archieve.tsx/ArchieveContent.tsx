export default function ArchieveContent() {
  return (
    <>
      <div className="flex lg:flex-row flex-col justify-between items-center w-full gap-10">
        <div className="flex flex-col justify-start items-start xl:w-1/2 lg:w-[60%] gap-4 -mt-10 self-start">
          <h1 className="bg-[#1c1c1e1a] flex justify-center items-center text-[#1c1c1e] px-3 py-2 font-Euclid font-medium uppercase rounded-md w-40 text-[12px]">
            Our Achievements
          </h1>
          <h3 className="font-Euclid font-bold xl:text-[45px] lg:text-[45px] md:text-[55px] text-[20px] text-[#1c1c1e] lg:w-[80%] w-full">
            Shaping Your Future with Online Banking
          </h3>
        </div>
        <div className="xl:w-1/2 lg:w-[40%]">
          <p className="font-Poppins font-medium text-[#656565] text-[18px] xl:w-[80%] w-full">
            With our comprehensive banking solution, you&apos;ll find that one
            card is truly enough. Our all-in-one card combines the functionality
            of multiple cards into a single, convenient solution, clutter and
            simplifying your wallet.
          </p>
        </div>
      </div>
    </>
  );
}
