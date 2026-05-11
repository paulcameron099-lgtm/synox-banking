"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaSearch,
  FaClipboardList,
  FaUniversity,
} from "react-icons/fa";

const benefits = [
  {
    icon: FaClock,
    title: "Your money, sooner.",
    text: "Set up an eligible direct deposit to a Synox Spending Account and receive your pay up to two days early when available.",
  },
  {
    icon: FaShieldAlt,
    title: "More protection when you need it.",
    text: "With qualified direct deposit, you may unlock extra account protection designed to help with accidental overdrafts.",
  },
  {
    icon: FaCheckCircle,
    title: "Added peace of mind.",
    text: "No more worrying about lost or delayed checks. Your deposit can arrive automatically every time you get paid.",
  },
];

const setupSteps = [
  {
    icon: FaUniversity,
    text: "Log in and select direct deposit",
  },
  {
    icon: FaSearch,
    text: "Find your payment provider",
  },
  {
    icon: FaCheckCircle,
    text: "Follow a few simple steps and you’re done",
  },
];

const infoCards = [
  {
    title: "Need a form? We’ve got those, too.",
    text: "Save time by letting Synox prefill a form with your preferences, or fill out a blank form whenever you’re ready. You can also use forms to split your direct deposit between two Synox accounts.",
    image: "/images/direct-form.svg",
    alt: "Direct deposit form",
  },
  {
    title: "All your account numbers. All in one place.",
    text: "No more hunting down your account and routing numbers. Find everything faster from your Synox direct deposit setup page.",
    image: "/images/direct-numbers.svg",
    alt: "Account numbers",
  },
];

export default function DirectDepositPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="w-full bg-black px-5 pb-20 pt-36 text-white md:px-10 lg:px-20 mt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="font-Euclid text-2xl font-bold md:text-4xl">
              Direct Deposit at Synox Bank
            </h1>

            <p className="mt-6 font-Euclid text-3xl font-bold leading-tight md:text-5xl">
              Get paid up to two days early.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative h-[280px] w-full max-w-[520px] overflow-hidden md:h-[300px]">
              <Image
                src="/images/direct-deposit-img.webp"
                alt="Direct deposit at Synox Bank"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-4xl">
            Quick setup. Awesome benefits.
          </h2>

          <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
            Changing or starting your direct deposit should not cause headaches.
            With Synox, you can set it up right from our website.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl gap-8 md:grid-cols-3">
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

                <p className="mt-4 font-Euclid text-sm leading-7 text-gray-600">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Setup Options */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-Euclid text-3xl font-bold text-black md:text-4xl">
            Simple setup options.
          </h2>

          <div className="mt-12 rounded-3xl bg-black p-6 text-white md:p-10 lg:p-14">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex justify-center">
                <div className="relative h-60 w-full max-w-[380px] overflow-hidden md:h-[500px]">
                  <Image
                    src="/images/new-direct.jpeg"
                    alt="Direct deposit setup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="font-Euclid text-3xl font-bold md:text-3xl">
                  Set up automatically in just a few taps.
                </h3>

                <div className="mt-8 space-y-5">
                  {setupSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.text}
                        className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 text-left"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                          <Icon />
                        </div>

                        <p className="font-Euclid font-medium text-white">
                          {step.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-8">
          {infoCards.map((card) => (
            <div
              key={card.title}
              className="grid items-center gap-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1.4fr_0.6fr]"
            >
              <div className="text-center lg:text-left">
                <h2 className="font-Euclid text-1xl font-bold text-black md:text-3xl">
                  {card.title}
                </h2>

                <p className="mt-4 font-Euclid text-base leading-8 text-gray-600 md:text-lg">
                  {card.text}
                </p>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative h-[150px] w-full max-w-[180px] overflow-hidden md:h-[140px]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gray-100 px-6 py-14 text-center md:px-10">
          <h2 className="font-Euclid text-3xl font-bold text-black md:text-4xl">
            Bank better, starting now.
          </h2>

          <p className="mt-5 font-Euclid text-lg text-gray-600">
            Open a Spending Account today to start getting paid early.
          </p>

          <Link
            href="/checking"
            className="mt-8 inline-flex rounded-full bg-black px-8 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
          >
            Open Account
          </Link>
        </div>
      </section>
    </main>
  );
}