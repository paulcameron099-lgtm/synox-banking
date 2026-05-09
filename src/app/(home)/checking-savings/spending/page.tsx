"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaShieldAlt,
  FaUniversity,
  FaMoneyBillWave,
  FaChevronRight,
  FaChevronDown,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

type AccordionItem = {
  title: string;
  content: string;
};

const benefits = [
  {
    title: "Keep more of your money.",
    text: "No monthly maintenance fees, overdraft fees, or minimum balance requirements to earn interest.",
    icon: FaMoneyBillWave,
  },
  {
    title: "No branch, no problem.",
    text: "Access thousands of no-fee ATMs, pay bills online, send money easily, and get support when you need it.",
    icon: FaUniversity,
  },
  {
    title: "Security, always on our mind.",
    text: "Get alerts for unusual activity and enjoy protection designed to keep your money safer.",
    icon: FaShieldAlt,
  },
];

const coverage = [
  {
    title: "Get reimbursed for ATM fees.",
    text: "When you are far from a no-fee ATM, Synox can reimburse eligible ATM fees up to $10 per statement cycle.",
  },
  {
    title: "Add cash with ease.",
    text: "Add cash to your account through supported retail locations and keep your money moving without stress.",
  },
  {
    title: "Say hello to early paydays.",
    text: "Set up direct deposit and receive eligible payments up to 2 days early.",
  },
  {
    title: "Protect against overspending.",
    text: "Use smart balance alerts and transfer tools to help avoid spending more than you planned.",
  },
];

const smartTools: AccordionItem[] = [
  {
    title: "Track your cash flow",
    content:
      "Spot spending patterns and plan smarter with a cash flow view that helps you see whether you are spending more than you are bringing in each month.",
  },
  {
    title: "Budget with Buckets",
    content:
      "Set money aside for bills, goals, and expenses using digital envelopes that make budgeting easier.",
  },
  {
    title: "Monitor your credit",
    content:
      "Stay aware of your credit score and catch possible issues early, so you can make better financial decisions.",
  },
];

const steps = [
  {
    number: "1",
    title: "Tell us about yourself.",
    text: "We’ll ask for a few details, like your address and identity information, to help set up your account securely.",
  },
  {
    number: "2",
    title: "Add money to your account.",
    text: "Fund your account when you are ready, so your money can start working for you sooner.",
  },
  {
    number: "3",
    title: "Enjoy all the perks.",
    text: "Start using simple tools, flexible access, and smart banking features built around your daily life.",
  },
];

const reviews = [
  {
    tag: "Most Helpful",
    title: "The BEST banking experience",
    text: "Synox makes it simple to manage my money in one place. The interface is clean, transfers are easy, and I feel more in control of my spending and savings every day.",
    author: "LivingLargeInLV",
    date: "10/31/2024",
  },
  {
    tag: "Most Recent",
    title: "Great bank",
    text: "The service feels modern and reliable. I like how easy it is to check balances, move money, and manage my account without needing to visit a branch.",
    author: "Verified Customer",
    date: "05/06/2026",
  },
  {
    tag: "Highest Rating",
    title: "Best thing for tucking money away",
    text: "I love that I can make small deposits here and there and still feel like I am building toward something meaningful.",
    author: "Anty",
    date: "05/06/2026",
  },
];

const freeFees = [
  ["Monthly maintenance", "$0"],
  ["Overdraft items", "$0"],
  ["Low daily balance", "$0"],
  ["Standard checks and debit cards", "$0"],
  ["Deposit slips and prepaid envelopes", "$0"],
  ["Standard or expedited transfers", "$0"],
];

const paidFees = [
  ["Expedited delivery for debit cards", "$15"],
  ["Outgoing domestic wires", "$20"],
  ["Stop payment", "$15"],
  ["Overnight bill pay", "$14.95"],
  ["Same-day bill pay", "$9.95"],
  ["International transactions", "up to 1%"],
];

export default function SpendingPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="w-full bg-black px-5 pb-16 pt-36 text-white md:px-10 lg:px-20 mt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="font-Euclid text-xl font-semibold md:text-2xl">
              Synox Bank Spending Account
            </p>

            <h1 className="mt-5 font-Euclid text-4xl font-bold leading-tight md:text-6xl">
              A checking account built for convenience.
            </h1>

            <Link
              href="/checking"
              className="mt-8 inline-flex rounded-full bg-yellow-500 px-8 py-4 font-Euclid font-semibold text-black hover:bg-yellow-400"
            >
              Open New Account
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="relative h-[260px] w-full max-w-[480px] overflow-hidden md:h-[360px]">
              <Image
                src="/images/synox-spending.webp"
                alt="Synox Bank"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* No monthly fees */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-Euclid text-3xl font-bold text-black md:text-5xl">
            No monthly fees, more money to work with.
          </h2>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[260px] overflow-hidden md:h-[420px]">
              <Image
                src="/images/spending-fees-image.webp"
                alt="Synox spending account"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center lg:text-left">
              <p className="font-Euclid text-lg leading-8 text-gray-700 md:text-xl">
                With no monthly maintenance fees, your money stays focused on
                what matters most. Synox gives you simple access to everyday
                banking without hidden conditions, confusing charges, or
                unnecessary stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-Euclid text-3xl font-bold text-black md:text-4xl">
            A checking account that puts you first.
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((item) => {
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

                  <p className="mt-3 font-Euclid text-sm leading-7 text-gray-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Covered */}
      <section className="w-full bg-black px-5 py-20 text-white md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-Euclid text-3xl font-bold md:text-5xl">
            We’ve got you covered.
          </h2>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[280px] overflow-hidden md:h-[520px]">
              <Image
                src="/images/spending-image2.webp"
                alt="Synox ATM support"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-8 text-center lg:text-left">
              {coverage.map((item) => (
                <div key={item.title}>
                  <h2 className="font-Euclid text-2xl font-bold">
                    {item.title}
                  </h2>
                  <p className="mt-3 font-Euclid leading-7 text-gray-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Smart tools */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              Zoom in with smart tools.
            </h2>

            <p className="mt-4 font-Euclid text-lg leading-8 text-gray-600">
              Bring your finances into sharper focus with tools built directly
              into your Synox account.
            </p>

            <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
              {smartTools.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={item.title}
                    className={index !== smartTools.length - 1 ? "border-b" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left font-Euclid font-semibold text-black hover:text-yellow-500"
                    >
                      <span>{item.title}</span>
                      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 font-Euclid text-sm leading-7 text-gray-600">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-3xl  md:h-[520px]">
            <Image
              src="/images/bank-spending-happy-path-graph.webp"
              alt="Synox smart banking tools"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Transparency */}
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
            <FeeTable
              title="There’s a lot we don’t charge for"
              rows={freeFees}
            />

            <FeeTable
              title="...and we won’t hide the fees we do have."
              rows={paidFees}
            />
          </div>
        </div>
      </section>

      {/* Rates */}
        <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
            <h5 className="font-Euclid text-3xl font-bold text-black md:text-4xl">
            Get more for your money.
            </h5>

            <p className="mt-4 font-Euclid text-lg text-gray-600">
            Find out how our rates stack up with other checking accounts.
            </p>

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
                <h3 className="font-Euclid text-xl font-bold text-black">
                Synox Bank Spending Account balance tiers:
                </h3>

                <div className="space-y-4 font-Euclid text-gray-700">
                <p>
                    Less than $15,000 ={" "}
                    <span className="font-bold text-black">
                    0.10% Annual Percentage Yield &#40;APY&#41;
                    </span>
                </p>

                <p>
                    $15,000 or more ={" "}
                    <span className="font-bold text-black">
                    0.25% Annual Percentage Yield &#40;APY&#41;
                    </span>
                </p>
                </div>
            </div>
            </div>

            <div className="mt-10 text-left">
            <h3 className="font-Euclid text-2xl font-bold text-black">
                What you should know.
            </h3>

            <p className="mt-4 font-Euclid leading-8 text-gray-600">
                No minimum deposit is required to open an account. Our Annual
                Percentage Yields &#40;APYs&#41; are accurate as of 05/08/2026.
                These rates are variable and may change after the account is opened.
                Fees may reduce earnings. Any comparison rates shown are for general
                reference only and may vary by bank, location, and account terms.
            </p>
            </div>
        </div>
        </section>

        {/* Getting Started */}
        <section className="w-full bg-black px-5 py-20 text-white md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="text-center lg:text-left">
                <h2 className="font-Euclid text-3xl font-bold md:text-5xl">
                Better banking, starting now.
                </h2>

                <p className="mt-5 font-Euclid text-lg text-gray-300">
                Get your account up and running in minutes.
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
                href="/checking"
                className="inline-flex rounded-full border border-white px-8 py-4 font-Euclid font-semibold text-white hover:bg-white hover:text-black"
            >
                Open new account
            </Link>
            </div>
        </div>
        </section>

        {/* Reviews */}
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
                4.3 &#40;10,052 Reviews&#41;
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
    </main>
  );
}

function FeeTable({
  title,
  rows,
}: {
  title: string;
  rows: string[][];
}) {
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