"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChartLine,
  FaBullseye,
  FaPiggyBank,
  FaSyncAlt,
  FaCoins,
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";

const boosterCards = [
  {
    icon: FaSyncAlt,
    title: "Recurring Transfers",
    text: "Set it and forget it. Move money into your savings on a schedule that works for you.",
  },
  {
    icon: FaCoins,
    title: "Round Ups",
    text: "Round up eligible spending transactions and move the extra change into savings once it reaches your transfer amount.",
  },
  {
    icon: FaPiggyBank,
    title: "Surprise Savings",
    text: "We help identify safe-to-save money from linked accounts and move it into savings automatically.",
  },
];

const blackFeatures = [
  {
    icon: FaMoneyBillWave,
    title: "No monthly maintenance fees or minimum balance requirements.",
    text: "Keep more of your money while still enjoying helpful tools built for everyday saving.",
  },
  {
    icon: FaPiggyBank,
    title: "Your money earns money with interest compounded daily.",
    text: "Rates are variable and may change after the account is opened. Deposits are protected up to applicable limits.",
  },
  {
    icon: FaChartLine,
    title: "Earn more with a competitive savings rate.",
    text: "Synox gives your savings room to grow with a strong APY across all balance tiers.",
  },
  {
    icon: FaHeadset,
    title: "24/7 support.",
    text: "Call, chat, or email any time. A real person is available to help when you need support.",
  },
];

const freeFees = [
  ["Monthly maintenance", "$0"],
  ["Minimum opening deposit", "$0"],
  ["Low daily balance", "$0"],
  ["Standard transfers", "$0"],
  ["Savings buckets", "$0"],
  ["Online statements", "$0"],
];

const paidFees = [
  ["Outgoing domestic wires", "$20"],
  ["Stop payment", "$15"],
  ["Expedited document delivery", "$15"],
  ["Excess transaction review", "$0"],
  ["International transactions", "up to 1%"],
];

const steps = [
  {
    number: "1",
    title: "Tell us about yourself.",
    text: "We’ll ask for a few details to help create and protect your account.",
  },
  {
    number: "2",
    title: "Fund your savings.",
    text: "Add money when you are ready and start earning interest on your balance.",
  },
  {
    number: "3",
    title: "Use your smart tools.",
    text: "Organize your savings with buckets, boosters, and helpful account insights.",
  },
];

const reviews = [
  {
    tag: "Most Helpful",
    title: "Saving finally feels simple",
    text: "Synox makes it easy to separate my money for different goals. I can see what I’m saving for and track my progress without opening multiple accounts.",
    author: "GracefulSaver",
    date: "10/31/2024",
  },
  {
    tag: "Most Recent",
    title: "Clean and easy to use",
    text: "The savings tools are simple and useful. I like being able to organize my goals and move money without stress.",
    author: "Verified Customer",
    date: "05/06/2026",
  },
  {
    tag: "Highest Rating",
    title: "Great for goals",
    text: "I use buckets for travel, emergency savings, and bills. It helps me stay disciplined without overthinking it.",
    author: "Anty",
    date: "05/06/2026",
  },
];

export default function SavingsPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="relative w-full px-5 pb-20 pt-36 md:px-10 lg:px-20">
        <div className="absolute inset-0">
          <Image
            src="/images/saving-background.avif"
            alt="Synox savings"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl md:p-10">
            <h1 className="font-Euclid text-2xl font-bold text-black">
              Synox Bank Savings Account
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex text-yellow-500">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <p className="font-Euclid text-sm font-semibold text-black">
                4.6 &#40;11,410 Reviews&#41;
              </p>
            </div>

            <h2 className="mt-6 font-Euclid text-3xl font-bold leading-tight text-black md:text-4xl">
              Save smarter for what matters most.
            </h2>

            <p className="mt-6 font-Euclid text-6xl font-bold text-black">
              3.10%
            </p>

            <p className="mt-3 font-Euclid text-gray-600">
              Annual Percentage Yield on all balance tiers
            </p>

            <Link
              href="/savings"
              className="mt-8 inline-flex rounded-full bg-black px-8 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
            >
              Open New Account
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            Finally, a savings account that helps your money work smarter.
          </h2>

          <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
            Along with a competitive variable rate and no monthly maintenance
            fees, the Synox Bank Savings Account gives you simple tools to help
            organize your goals, automate good habits, and grow your money with
            more confidence.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[280px] overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:h-[480px]">
            <Image
              src="/images/saving-analysis.avif"
              alt="Savings analysis"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-10">
            <FeatureText
              icon={FaChartLine}
              title="Analyze where you’ve been."
              text="Get a clear picture of what is moving your savings balance, so you can understand your habits and make better decisions."
            />

            <FeatureText
              icon={FaBullseye}
              title="Visualize where you could go."
              text="Use smart projections to see how small changes today could help you reach tomorrow’s goals faster."
            />
          </div>
        </div>
      </section>

      {/* Buckets */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            Organize using buckets.
          </h2>
          <p className="mt-4 font-Euclid text-lg text-gray-600">
            Set money aside for what matters to you. All in one place.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[280px] overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:h-[480px]">
            <Image
              src="/images/savings-bucket.avif"
              alt="Savings buckets"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center lg:text-left">
            <h3 className="font-Euclid text-3xl font-bold text-black">
              Divide your savings without opening multiple accounts.
            </h3>
            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              Like digital envelopes, savings buckets help you set money aside
              for specific goals while still earning interest on your total
              balance. Use them for travel, bills, emergency funds, or anything
              you are building toward.
            </p>
          </div>
        </div>
      </section>

      {/* Boosters */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            Optimize with boosters.
          </h2>
          <p className="mt-4 font-Euclid text-lg text-gray-600">
            Accelerate your savings and put part of your strategy on autopilot.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-3">
          {boosterCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="mt-6 font-Euclid text-2xl font-bold text-black">
                  {card.title}
                </h3>
                <p className="mt-4 font-Euclid leading-7 text-gray-600">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dynamic duo */}
      <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[280px] overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:h-[480px]">
            <Image
              src="/images/dynamic-duo.avif"
              alt="Savings and spending"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              Meet our dynamic duo.
            </h2>
            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              Synox Savings and Spending Accounts work better together. With
              features like round ups and buckets, you can grow your savings
              while staying on top of everyday spending.
            </p>

            <Link
              href="/savings"
              className="mt-8 inline-flex rounded-full bg-black px-8 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
            >
              Open both accounts
            </Link>
          </div>
        </div>
      </section>

      {/* Black Features */}
      <section className="w-full bg-black px-5 py-20 text-white md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-Euclid text-3xl font-bold md:text-5xl">
            Come for the helpful tools. Stay for everything else.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {blackFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="mt-6 font-Euclid text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-Euclid text-sm leading-7 text-gray-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
      </section>

      <div className="mx-auto mt-16 max-w-2xl rounded-3xl bg-gray-100 p-8 text-center text-black md:p-10">
            <h3 className="font-Euclid text-2xl font-bold">
              Direct deposit is a breeze.
            </h3>
            <p className="mt-3 font-Euclid text-gray-600">
              Let us prefill your form so you can focus on growing your
              savings.
            </p>
            <Link
              href="/direct-deposit"
              className="mt-6 inline-flex rounded-full bg-black px-7 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
            >
              Explore Direct Deposit
            </Link>
          </div>

      {/* What you should know */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-Euclid text-3xl font-bold text-black">
            What you should know.
          </h2>

          <div className="mt-6 space-y-5 font-Euclid leading-8 text-gray-600">
            <p>
              Our savings account information is accurate as of 04/20/2026.
              Rates and features may change, and fees may reduce earnings.
            </p>
            <p>
              Synox Bank Savings Accounts use balance tiers. We are required to
              explain that the APY paid is based on the tier where your
              end-of-day balance falls.
            </p>
            <p>
              For now, Synox makes the current APY available across all balance
              tiers, so your money earns the same advertised rate whether your
              balance is small or large.
            </p>
          </div>

          <h3 className="mt-8 font-Euclid text-xl font-bold text-black">
            Synox Bank Savings Account balance tiers:
          </h3>

          <ul className="mt-4 space-y-3 font-Euclid text-gray-600">
            <li className="flex gap-3">
              <span className="mt-3 h-2 w-2 rounded-full bg-black" />
              Less than $5,000
            </li>
            <li className="flex gap-3">
              <span className="mt-3 h-2 w-2 rounded-full bg-black" />
              Between $5,000 and $24,999.99
            </li>
            <li className="flex gap-3">
              <span className="mt-3 h-2 w-2 rounded-full bg-black" />
              $25,000 or more
            </li>
          </ul>

          <p className="mt-6 font-Euclid leading-8 text-gray-600">
            APYs are variable and subject to change. The Synox Savings Account
            is designed to give customers a strong rate, simple tools, and a
            clearer way to organize their financial goals.
          </p>
        </div>
      </section>

      <TransparencySection />
      <GettingStartedSection />
      <ReviewsSection />
    </main>
  );
}

function FeatureText({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
        <Icon className="text-2xl" />
      </div>
      <div>
        <h3 className="font-Euclid text-2xl font-bold text-black">{title}</h3>
        <p className="mt-3 font-Euclid leading-7 text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function TransparencySection() {
  return (
    <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            Trust through transparency.
          </h2>
          <p className="mt-4 font-Euclid text-lg text-gray-600">
            Giving you the full picture of where your money goes.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <FeeTable title="There’s a lot we don’t charge for" rows={freeFees} />
          <FeeTable
            title="...and we won’t hide the fees we do have."
            rows={paidFees}
          />
        </div>
      </div>
    </section>
  );
}

function FeeTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="font-Euclid text-2xl font-bold text-black">{title}</h2>

      <div className="mt-6">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-6 border-b border-gray-200 py-5 font-Euclid"
          >
            <span className="text-sm font-medium text-gray-700 md:text-base">
              {label}
            </span>
            <span className="shrink-0 text-sm font-bold text-black md:text-base">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <section className="w-full bg-black px-5 py-20 text-white md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-3xl font-bold md:text-5xl">
              Better saving, starting now.
            </h2>
            <p className="mt-5 font-Euclid text-lg text-gray-300">
              Open your Synox Savings Account in minutes.
            </p>
          </div>

          <div className="space-y-10">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white font-Euclid text-xl font-bold text-black">
                    {step.number}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="mt-3 h-16 border-l-2 border-dashed border-white/50" />
                  )}
                </div>

                <div>
                  <h3 className="font-Euclid text-2xl font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-3 font-Euclid leading-7 text-gray-300">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/savings"
            className="inline-flex rounded-full border border-white px-8 py-4 font-Euclid font-semibold text-white hover:bg-white hover:text-black"
          >
            Open new account
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="w-full px-5 py-24 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            The reviews are in.
          </h2>
          <p className="mt-4 font-Euclid text-lg text-gray-600">
            People like it here. We think you will, too.
          </p>

          <p className="mt-8 font-Euclid font-semibold text-gray-700">
            Average Rating
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <div className="flex text-yellow-500">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaRegStar />
            </div>
            <p className="font-Euclid font-semibold text-black">
              4.6 &#40;11,410 Reviews&#41;
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.tag}
              className="flex min-h-full flex-col rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
            >
              <p className="font-Euclid text-sm font-semibold text-yellow-600">
                {review.tag}
              </p>

              <div className="mt-4 flex text-yellow-500">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <h3 className="mt-6 font-Euclid text-2xl font-bold text-black">
                {review.title}
              </h3>

              <p className="mt-4 flex-1 font-Euclid leading-7 text-gray-600">
                {review.text}
              </p>

              <p className="mt-8 font-Euclid text-sm font-semibold text-gray-700">
                - {review.author} on {review.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}