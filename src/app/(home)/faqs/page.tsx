"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

const roles = [
  {
  title: "How can I add cash to my account?",
  text: "You can add cash to your Synox account through eligible retail locations and supported ATM networks. Simply use your Synox debit card or linked account details to complete the deposit. Funds are typically available shortly after the transaction is processed.",
},
  {
    title: "When will i receive my debit card or checks?",
    text: "If you requested checks or a debit card, your order should arrive within 10 business days after we receive your opening deposit. If you didn't request checks or a debit card while opening your account, please call us at 1-877-247-2559 to place your order. When re-ordering standard checks, your order should arrive within 10 business days after your request is submitted.",
  },
  {
    title: "How can i access the money in my spending account?",
    text: "Using the web or your mobile device, you can access your account, make payments, or move money at any time. You can also: Use a debit card or checks for purchases and payments",
  },
  {
    title: "How many withdrawal can i make from my savings account each month?",
    text: "You can make 10 limited withdrawals and transfers per statement cycle from your Savings Account. There’s no fee for going over the limit, but we’ll close your account if you exceed it on more than an occasional basis.",
  },
  {
    title: "What's the difference between a savings account and money market account?",
    text: "Our savings account includes buckets and boosters, designed to help you organize and optimize your savings. Like digital envelopes, savings buckets help you organize whatever you're saving for without needing multiple accounts. Boosters like Surprise Savings and Round ups are money-saving tools to help you reach your goals faster. Our money market account doesn't have buckets and boosters, but does offer a debit card and checks.",
  },
  {
    title: "What's the difference between a spending account and money market account?",
    text: "Both accounts give you easy access to your money and a competitive interest rate on your balance.",
  },
  {
    title: "Can i change or convert a savings account to a money market account?",
    text: "No, because the two account types include different features, and utilize different ways of accessing funds. Instead, a new Money Market Account must be opened. Then, you can choose to keep both accounts, or request to close the account you no longer want.",
  },
  {
    title: "How long will it take to start receiving direct deposit after setting it up?",
    text: "It should take about 1-2 pay cycles before your new direct deposit takes effect. Check with your employer or payment provider for more information.",
  },
  {
    title: "What is early direct deposit?",
    text: "Simply put, your eligible paycheck is available up to 2 days before your regular payday. It’s a free, automatic feature we offer so you can pay bills, manage expenses, or earn interest on your money sooner. For example, if you normally get paid on Friday, you’ll now see your paycheck in your account as soon as Wednesday.",
  },
  {
    title: "Do you accept applications from recruiting agencies",
    text: "No, we don’t accept unsolicited resumes from recruiters.",
  },
    {
    title: "How do I apply for a job with Synox?",
    text: "Choose the role that best matches your experience and interests, then complete your application online. Some positions may require additional information or assessments during the process. After submitting your application, you’ll receive a confirmation email, and one of our recruiters may contact you if your background aligns with the role or other future opportunities at Synox.",
    },
];

export default function page() {
      const [openRole, setOpenRole] = useState<number | null>(0);

  return (
    <main className='w-full bg-white'>
       <section className="w-full px-5 py-20 md:px-10 lg:px-20 mt-20">
              <div className="mx-auto max-w-5xl text-center">
                <h2 className="font-Euclid text-2xl font-bold text-black md:text-4xl">
                Frequently asked questions.
                </h2>
      
                <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
                Find answers to common questions about Synox accounts, payments,
                transfers, security, direct deposit, and more. We’re here to help
                make your banking experience simple and stress-free.
                </p>
              </div>
      
              <div className="mx-auto mt-14 grid max-w-7xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
                  {roles.map((role, index) => {
                    const isOpen = openRole === index;
      
                    return (
                      <div key={role.title} className={index !== roles.length - 1 ? "border-b" : ""}>
                        <button
                          type="button"
                          onClick={() => setOpenRole(isOpen ? null : index)}
                          className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-Euclid font-semibold text-black hover:text-yellow-500"
                        >
                          <span>{role.title}</span>
                          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </button>
      
                        <div
                          className={`grid transition-all duration-500 ease-in-out ${
                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-6 pb-6 font-Euclid leading-7 text-gray-600">
                              {role.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
      
              <p className="mx-auto mt-10 max-w-4xl text-center font-Euclid text-lg leading-8 text-gray-600">
                Still need help? Our support team is available to guide you whenever
                you need assistance.
                </p>
            </section>
    </main>
  )
}
