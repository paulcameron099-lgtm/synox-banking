"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

type AccountType = "featured" | "checking" | "savings" | "money-market";

const tabs = [
  { id: "featured", label: "Featured" },
  { id: "checking", label: "Checking" },
  { id: "savings", label: "Savings" },
  { id: "money-market", label: "Money Market" },
];

const accounts = [
  {
    type: "checking",
    title: "Spending",
    description:
      "Great for: Making everyday purchases with all the benefits of a checking account, including 24/7 support, fraud protection and access to no-fee ATMs.",
    apyOne: "0.10%",
     annual: "Annual Percentage Yield &#40;APY&#41;",
    apyOneText: "For daily balances less than $15,000",
    apyTwo: "0.25%",
    apyTwoText: "For daily balances of $15,000 or more",
    benefits: [
      "Use any Allpoint® or MoneyPass® ATM in the U.S. for free",
      "Unlimited deposits",
      "No minimum opening deposit",
      "24/7 fraud monitoring",
    ],
    detailsLink: "/checking-savings/spending",
    detailsLinks: "/checking",
  },

  {
    type: "savings",
    title: "Savings Plus",
    description:
      "Great for: Building long-term savings with competitive interest rates and smart savings tools.",
       annual: "Annual Percentage Yield &#40;APY&#41;",

    apyOne: "1.20%",
    apyOneText: "For balances less than $25,000",

    apyTwo: "2.00%",
    apyTwoText: "For balances of $25,000 or more",

    benefits: [
      "Automatic savings tools",
      "Competitive interest rates",
      "No monthly maintenance fees",
      "FDIC insured accounts",
    ],

    detailsLink: "/checking-savings/savings",
    detailsLinks: "/savings",
  },

  {
    type: "money-market",
    title: "Money Market",
    description:
      "Great for: Earning higher interest while keeping flexible access to your money.",
    annual: "Annual Percentage Yield &#40;APY&#41;",

    apyOne: "2.50%",
    apyOneText: "For balances less than $50,000",

    apyTwo: "3.10%",
    apyTwoText: "For balances of $50,000 or more",

    benefits: [
      "Higher APY earnings",
      "Flexible withdrawals",
      "Premium banking tools",
      "No hidden charges",
    ],

    detailsLink: "/checking-savings/money-market",
    detailsLinks: "/savings",
  },
];

export default function OpenAccountPage() {
  const [activeTab, setActiveTab] = useState<AccountType>("featured");

  const filteredAccounts =
    activeTab === "featured"
      ? accounts
      : accounts.filter((account) => account.type === activeTab);

  return (
    <main className="w-full bg-white">
      {/* Yellow Hero Section */}
      <section className="w-full bg-black px-5 pb-16 pt-36 md:px-10 lg:px-20 mt-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-Euclid text-3xl font-bold text-white md:text-5xl">
            Synox Bank Accounts and Rates
          </h1>

          <div className="mt-20 grid gap-5 text-white md:grid-cols-3">
            <div className="flex items-center justify-center gap-3">
              <FaCheckCircle />
              <span className="font-Euclid font-medium">
                No account minimums
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <FaCheckCircle />
              <span className="font-Euclid font-medium">
                No monthly maintenance fees
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <FaCheckCircle />
              <span className="font-Euclid font-medium">
                Competitive rates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* White Section */}
      <section className="w-full bg-white px-5 py-12 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Tabs */}
          <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-full border border-gray-300 sm:flex-row">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AccountType)}
                className={`flex-1 px-6 py-4 font-Euclid text-sm font-semibold transition hover:text-yellow-500 ${
                  activeTab === tab.id
                    ? "bg-black text-white hover:text-white"
                    : "bg-white text-black"
                } ${
                  index !== tabs.length - 1
                    ? "border-b border-gray-300 sm:border-b-0 sm:border-r"
                    : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {filteredAccounts.map((account) => (
              <div
                key={account.type}
                className="flex min-h-full flex-col rounded-3xl border border-gray-300 bg-white p-6 shadow-sm"
              >
                <h2 className="font-Euclid text-2xl font-bold text-black">
                  {account.title}
                </h2>

                <div className="mt-6 flex gap-3 rounded-2xl bg-gray-100 p-5">
                  <FaCheckCircle className="mt-1 shrink-0 text-green-600" />
                  <p className="font-Euclid text-sm leading-6 text-gray-700">
                    {account.description}
                    </p>
                </div>

                <div className="mt-8">
                  <p className="font-Euclid text-sm font-medium text-gray-600">
                    {account.annual}
                  </p>

                  <h3 className="mt-3 font-Euclid text-5xl font-bold text-black">
                    {account.apyOne}
                  </h3>

                  <p className="mt-2 font-Euclid text-sm text-gray-600">
                    {account.apyOneText}
                  </p>

                  <h3 className="mt-8 font-Euclid text-5xl font-bold text-black">
                    {account.apyTwo}
                  </h3>

                  <p className="mt-2 font-Euclid text-sm text-gray-600">
                    {account.apyTwoText}
                  </p>
                </div>

                <ul className="mt-8 space-y-4 font-Euclid text-sm leading-6 text-gray-700">
                {account.benefits.map((benefit, index) => (
                    <li key={index} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-black" />
                    {benefit}
                    </li>
                ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href={account.detailsLink}
                    className="font-Euclid font-semibold text-black underline hover:text-yellow-500"
                  >
                    View Details
                  </Link>

                  <Link
                    href={account.detailsLinks}
                    className="mt-6 flex w-full items-center justify-center rounded-full bg-black px-6 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
                  >
                    Open Account
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-Euclid text-sm text-gray-600">
            Annual Percentage Yields &#40;APYs&#41; displayed are accurate as of
            05/08/2026.
          </p>
        </div>
      </section>
    </main>
  );
}