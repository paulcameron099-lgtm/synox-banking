"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCreditCard,
  FaChartLine,
  FaMobileAlt,
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";

const moneyBenefits = [
  {
    icon: FaCreditCard,
    title: "Use thousands of ATMs with no Synox fee.",
    text: "Make ATM withdrawals at supported no-fee ATM networks and keep more of your money. Synox can also reimburse eligible out-of-network ATM fees up to $10 per statement cycle.",
  },
  {
    icon: FaChartLine,
    title: "Your money earns money with a competitive rate.",
    text: "With interest compounded daily, your balance has more room to grow. Rates are variable and may change after the account is opened.",
  },
  {
    icon: FaMobileAlt,
    title: "Deposit checks remotely.",
    text: "Use Synox mobile check deposit to add checks from your phone. Snap a photo, submit it securely, and manage your money from anywhere.",
  },
];

const blackFeatures = [
  {
    icon: FaShieldAlt,
    title: "Open in the name of a trust.",
    text: "Create more flexibility and security for the people and goals that matter most.",
  },
  {
    icon: FaMoneyBillWave,
    title: "No monthly maintenance fees or minimum balance requirements.",
    text: "No hidden monthly maintenance fees. You can make unlimited ATM withdrawals and manage your money with more flexibility.",
  },
  {
    icon: FaHeadset,
    title: "24/7 support.",
    text: "Call, chat, or email us any time. A real person is available to help, day or night.",
  },
];

const freeFees = [
  ["Monthly maintenance", "$0"],
  ["Minimum opening deposit", "$0"],
  ["Low daily balance", "$0"],
  ["Standard debit card", "$0"],
  ["Standard checks", "$0"],
  ["Online statements", "$0"],
];

const paidFees = [
  ["Outgoing domestic wires", "$20"],
  ["Stop payment", "$15"],
  ["Expedited debit card delivery", "$15"],
  ["Overnight check delivery", "$14.95"],
  ["International transactions", "up to 1%"],
];

const steps = [
  {
    number: "1",
    title: "Tell us about yourself.",
    text: "We’ll collect a few details to help create and protect your Money Market Account.",
  },
  {
    number: "2",
    title: "Fund your account.",
    text: "Add money when you are ready and start earning interest on your balance.",
  },
  {
    number: "3",
    title: "Access your money with flexibility.",
    text: "Use checks, debit card access, ATM withdrawals, and online tools to manage your money easily.",
  },
];

const reviews = [
  {
    tag: "Most Helpful",
    title: "Flexible and easy to manage",
    text: "I like that Synox gives me the feel of a savings account with more ways to access my money. The rate is strong, and the account is simple to manage.",
    author: "SmartSaver",
    date: "10/31/2024",
  },
  {
    tag: "Most Recent",
    title: "Great balance of access and growth",
    text: "The Money Market Account is useful because I can keep my money earning interest while still having flexible access when I need it.",
    author: "Verified Customer",
    date: "05/06/2026",
  },
  {
    tag: "Highest Rating",
    title: "Exactly what I needed",
    text: "I wanted something more flexible than a regular savings account. This gives me access, organization, and a competitive rate in one place.",
    author: "Anty",
    date: "05/06/2026",
  },
];

export default function MoneyMarketPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="w-full bg-black px-5 pb-20 pt-36 text-white md:px-10 lg:px-20 mt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="font-Euclid text-2xl font-bold md:text-3xl">
              Synox Bank Money Market Account
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <div className="flex text-yellow-500">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <p className="font-Euclid text-sm font-semibold">
                4.5 &#40;2,770 Reviews&#41;
              </p>
            </div>

            <h2 className="mt-6 font-Euclid text-4xl font-bold leading-tight md:text-6xl">
              Grow your money. Keep it close.
            </h2>

            <p className="mt-8 font-Euclid text-6xl font-bold text-yellow-500">
              3.10%
            </p>

            <p className="mt-3 font-Euclid text-gray-300">
              Annual Percentage Yield on all balance tiers
            </p>

            <Link
              href="/savings"
              className="mt-8 inline-flex rounded-full bg-yellow-500 px-8 py-4 font-Euclid font-semibold text-black hover:bg-yellow-400"
            >
              Open New Account
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="relative h-[280px] w-full max-w-[520px] overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl md:h-[420px]">
              <Image
                src="/images/money-market-image.avif"
                alt="Synox Money Market Account"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Benefits */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
            Give your savings a turbo boost.
          </h2>

          <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
            The Synox Money Market Account gives you a competitive rate to grow
            your money, plus flexible ways to access it when you need it.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-3">
          {moneyBenefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <Icon className="text-2xl" />
                </div>

                <h3 className="mt-6 font-Euclid text-xl font-bold text-black">
                  {item.title}
                </h3>

                <p className="mt-4 font-Euclid text-sm leading-7 text-gray-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Black Features */}
      <section className="w-full bg-black px-5 py-20 text-white md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-Euclid text-3xl font-bold md:text-5xl">
            Features offered with every Synox Bank account.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
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
              Direct deposit is simple.
            </h3>

            <p className="mt-3 font-Euclid text-gray-600">
              Let Synox help you prepare your direct deposit details so your
              money can move into your account with less effort.
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
              Synox Money Market Account information is accurate as of
              04/20/2026. Rates are variable and may change after the account is
              opened.
            </p>

            <p>
              This account is designed for customers who want a strong rate with
              more ways to access their money than a traditional savings
              account.
            </p>

            <p>
              Your APY is based on the balance tier where your end-of-day
              balance falls. Synox currently makes the advertised APY available
              across all balance tiers.
            </p>

            <p>
              Fees may reduce earnings. Always review the account details before
              opening a new account.
            </p>
          </div>

          <h3 className="mt-8 font-Euclid text-xl font-bold text-black">
            Synox Bank Money Market Account balance tiers:
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
            APYs are subject to change. The Synox Money Market Account is built
            to combine growth, flexibility, and access in one account.
          </p>
        </div>
      </section>

      <TransparencySection />
      <GettingStartedSection />
      <ReviewsSection />
    </main>
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
            Giving you a clear look at common account costs.
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
              Better banking, starting now.
            </h2>

            <p className="mt-5 font-Euclid text-lg text-gray-300">
              Open your Synox Money Market Account in minutes.
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
            People like the flexibility. We think you will, too.
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
              4.5 &#40;2,770 Reviews&#41;
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