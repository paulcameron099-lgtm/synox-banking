"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaComments,
  FaCheckCircle,
  FaUsers,
  FaBriefcase,
} from "react-icons/fa";

const roles = [
  {
    title: "Audit, Risk and Compliance",
    text: "Join our insight-driven team to improve operations, strengthen controls, and help Synox stay accountable as we grow.",
  },
  {
    title: "Consumer and Commercial Banking",
    text: "Create digital solutions that help people save, spend, and manage their financial lives with more confidence.",
  },
  {
    title: "Customer Care and Call Centers",
    text: "Become a trusted voice for customers by helping them get answers, solve problems, and feel supported.",
  },
  {
    title: "Dealer Financial Service",
    text: "Support financial solutions that help partners and customers access smarter financing experiences.",
  },
  {
    title: "Finance and Accounting",
    text: "Help us manage financial performance, improve reporting, and make stronger business decisions.",
  },
  {
    title: "Marketing, HR and Legal",
    text: "Grow and protect the Synox brand through people-first communication, thoughtful policies, and customer-centered strategy.",
  },
  {
    title: "Sales",
    text: "Contribute to business growth by building relationships, supporting customers, and connecting people with the right solutions.",
  },
  {
    title: "Technology",
    text: "Build secure, data-driven digital products and help transform how people bank online.",
  },
];

const hiringSteps = [
  {
    title: "Get to know us",
    icon: FaUsers,
    heading: "Get to know us.",
    body: (
      <>
        <p>
          Synox is a digital-first financial company focused on building simple,
          secure, and customer-friendly banking experiences.
        </p>
        <p>
          Learn about{" "}
          <Link href="/about" className="font-semibold underline hover:text-yellow-500">
            who we are
          </Link>{" "}
          and how our values shape a culture-forward, inclusive workplace.
        </p>
      </>
    ),
  },
  {
    title: "Find your fit",
    icon: FaSearch,
    heading: "Find your fit.",
    body: (
      <p>
        Explore opportunities that match your skills, upload your resume, and
        complete your application. You can check your progress as you move
        through the hiring process.
      </p>
    ),
  },
  {
    title: "Let’s talk",
    icon: FaComments,
    heading: "Let’s talk.",
    body: (
      <>
        <p>
          Our interview process may begin with a phone or video conversation
          with a recruiter, followed by another virtual or in-person discussion
          with team members or leaders.
        </p>
        <p>
          Treat it as a two-way conversation. We want to learn what motivates
          you, and we are happy to answer questions about Synox, the role, and
          the team.
        </p>
      </>
    ),
  },
  {
    title: "Become a Synox",
    icon: FaCheckCircle,
    heading: "Become a Synox.",
    body: (
      <>
        <p>
          If we offer you the role, you will receive a clear review of
          compensation, benefits, and next steps.
        </p>
        <p>
          Once you accept, you will get onboarding guidance to help you start
          strong and build a career you can be proud of.
        </p>
      </>
    ),
  },
];

const differenceCards = [
  {
    image: "/images/careers-culture.avif",
    title: "Culture and values",
    text: "Doing the right thing and working with respect are at the center of how we build.",
  },
  {
    image: "/images/careers-benefits.avif",
    title: "Best-in-class benefits",
    text: "Our benefits are designed to support your health, growth, and life outside work.",
  },
  {
    image: "/images/careers-diversity.avif",
    title: "Diversity, inclusion and belonging",
    text: "We value different voices and create space for people to contribute fully.",
  },
  {
    image: "/images/careers-giving.avif",
    title: "Giving back",
    text: "We support our communities because building a better future matters.",
  },
  {
    image: "/images/careers-accessibility.avif",
    title: "Accessibility and inclusivity",
    text: "We apply inclusive thinking throughout the way we design products and experiences.",
  },
  {
    image: "/images/careers-awards.avif",
    title: "Awards",
    text: "We aim to create a workplace people are proud of and excited to grow in.",
  },
];

export default function CareersPage() {
  const [openRole, setOpenRole] = useState<number | null>(0);
  const [openStep, setOpenStep] = useState<number | null>(0);

  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="relative w-full px-5 pb-20 pt-36 md:px-10 lg:px-20">
        <div className="absolute inset-0">
          <Image
            src="/images/careers-hero.avif"
            alt="Careers at Synox"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl md:p-10">
            <p className="font-Euclid text-lg font-semibold text-yellow-600">
              Careers
            </p>

            <h1 className="mt-4 font-Euclid text-4xl font-bold leading-tight text-black md:text-4xl">
              We all work better as allies.
            </h1>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              Join a team that believes in doing things right, whether we are
              helping people build better financial lives or helping each other
              grow in our careers.
            </p>
          </div>
        </div>
      </section>

      {/* Find your fit */}
      <section className="w-full px-5 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-Euclid text-2xl font-bold text-black md:text-4xl">
            Find your perfect fit.
          </h2>

          <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
            We are more than financial services. Synox has opportunities for
            builders, problem-solvers, designers, analysts, support teams, and
            people who love creating better customer experiences.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-7xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex justify-center">
            <div className="relative h-[260px] w-full max-w-[360px] overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:h-[360px]">
              <Image
                src="/images/careers-fit.avif"
                alt="Find your career fit"
                fill
                className="object-cover"
              />
            </div>
          </div>

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
          If your dream job is not in our search, it does not mean it is not
          here. It may simply not be available right now.
        </p>
      </section>

      {/* Hiring process */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-Euclid text-2xl font-bold text-black md:text-4xl">
              The first steps on your new career path.
            </h2>

            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              Here is a quick look at what to expect from our hiring process,
              from application to celebration.
            </p>
          </div>

          <div className="mx-auto mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
            {hiringSteps.map((step, index) => {
              const Icon = step.icon;
              const isOpen = openStep === index;

              return (
                <div key={step.title} className={index !== hiringSteps.length - 1 ? "border-b" : ""}>
                  <button
                    type="button"
                    onClick={() => setOpenStep(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-6 py-6 text-left font-Euclid text-xl font-bold text-black hover:text-yellow-500"
                  >
                    <span>{step.title}</span>
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-5 px-6 pb-8 sm:flex-row">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                          <Icon className="text-2xl" />
                        </div>

                        <div className="font-Euclid leading-8 text-gray-600">
                          <h3 className="mb-3 text-2xl font-bold text-black">
                            {step.heading}
                          </h3>

                          <div className="space-y-4">{step.body}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 border-t border-gray-200" />
        </div>
      </section>

      {/* Interns */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-2xl font-bold text-black md:text-4xl">
              A smart start for interns and recent grads.
            </h2>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              We are excited to help you begin your career at any stage. Synox
              interns and early-career teammates get room to learn, contribute,
              and grow into work they are proud of.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[240px] w-full max-w-[420px] overflow-hidden rounded-3xl bg-gray-100 shadow-lg md:h-[340px]">
              <Image
                src="/images/careers-interns.avif"
                alt="Interns and recent graduates"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Different ways */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-Euclid text-2xl font-bold text-black md:text-4xl">
              We’re different in all the right ways.
            </h2>

            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              The Synox experience goes beyond job titles. We offer
              opportunities to learn, grow, give back, and build a career you
              can be proud of.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {differenceCards.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="relative h-[200px] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-6 font-Euclid text-2xl font-bold text-black">
                  {item.title}
                </h3>

                <p className="mt-4 font-Euclid leading-7 text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-gray-200" />
        </div>
      </section>

      {/* Quotes */}
      <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.4fr_1fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-[220px] w-[220px] overflow-hidden rounded-full bg-gray-100 shadow-lg">
                <Image
                  src="/images/careers-quote-1.avif"
                  alt="Taylor Hobgood"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="font-Euclid text-[18px] font-semibold leading-10 text-black">
                “Working at Synox means being surrounded by people who genuinely care about 
                innovation, teamwork, and doing meaningful work. There’s a strong sense of 
                ownership here — every challenge is an opportunity to learn, improve, and 
                create better experiences for our customers. It’s motivating to be part of a 
                culture that values both personal growth and real impact.”
              </p>

              <p className="mt-6 font-Euclid text-lg font-bold text-black">
                Alicia Morgan
              </p>

              <p className="font-Euclid text-gray-600">
                Manager, Consumer Insights and Innovation
              </p>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.4fr]">
            <div className="text-center lg:text-left">
              <p className="font-Euclid text-[18px] font-semibold leading-10 text-black">
                “What stands out most about Synox is the balance between ambition and support. 
                You’re encouraged to think creatively, contribute ideas, and grow professionally 
                while still feeling heard and respected. The collaborative environment and focus on 
                people make it a rewarding place to build a long-term career.”
              </p>

              <p className="mt-6 font-Euclid text-lg font-bold text-black">
                Daniel Carter
              </p>

              <p className="font-Euclid text-gray-600">
                Senior Director, Marketing
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative h-[220px] w-[220px] overflow-hidden rounded-full bg-gray-100 shadow-lg">
                <Image
                  src="/images/careers-quote-2.avif"
                  alt="Brian Roach"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}