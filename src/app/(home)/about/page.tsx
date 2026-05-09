import Image from "next/image";
import Link from "next/link";

const commitments = [
  {
    image: "/images/about-row1.avif",
    title: "Impact in action.",
    text: "We believe progress should reach beyond banking. Through responsible technology, community support, and sustainable decisions, Synox works to create value for customers and the communities around them.",
  },
  {
    image: "/images/about-inclusion.avif",
    title: "Synox for all.",
    text: "We are building a culture where people feel respected, supported, and included. Different voices help us create better products, better service, and better outcomes.",
  },
  {
    image: "/images/about-future.avif",
    title: "Building a brighter future.",
    text: "Purpose, people, and innovation guide how we grow. By combining financial tools with responsible ideas, we aim to make banking simpler and more useful for everyday life.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="relative w-full px-5 pb-20 pt-36 md:px-10 lg:px-20">
        <div className="absolute inset-0">
          <Image
            src="/images/about-office.avif"
            alt="About Synox Bank"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl md:p-10">
            <p className="font-Euclid text-lg font-semibold text-yellow-600">
              About Us
            </p>

            <h1 className="mt-4 font-Euclid text-4xl font-bold leading-tight text-black md:text-5xl">
              We’re not just raising the bar, we’re redefining it.
            </h1>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              Synox is driven by technology, security, and innovation that make
              managing your finances simpler, smarter, and more accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Everyday experiences */}
      <section className="w-full px-5 py-32 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[280px] overflow-hidden rounded-3xl md:h-[380px]">
            <Image
              src="/images/about-everyday.avif"
              alt="Synox customer experience"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              Elevating everyday experiences.
            </h2>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              Money decisions can feel personal, complex, and sometimes
              overwhelming. Synox helps make them easier with digital tools,
              clear account features, and support designed around real customer
              needs.
            </p>

            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              From everyday banking to secure transfers and account management,
              our goal is to help people feel confident, informed, and in
              control of their financial life.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="w-full px-5 pb-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl border-t border-gray-200 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              Committed beyond business.
            </h2>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              At our core, we believe in empowerment, ethical practices, and
              strong relationships. That is why Synox is committed to putting
              customers, teams, and communities first in everything we build.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="relative h-[220px] overflow-hidden rounded-2xl bg-gray-100">
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
        </div>
      </section>

      {/* Digital disruptor */}
      <section className="w-full px-5 py-28 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              The original digital disruptor.
            </h2>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              Synox is built for the future of digital banking. We are always
              exploring better ways to improve speed, security, customer
              service, and financial insights through modern technology.
            </p>

            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              From smarter dashboards to responsible AI-driven fraud detection,
              our focus is simple: make banking safer, clearer, and more useful
              for the people who trust us.
            </p>
          </div>

          <div className="relative h-[280px] overflow-hidden rounded-3xl md:h-[380px]">
            <Image
              src="/images/about-digital.avif"
              alt="Synox digital banking"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="w-full px-5 pb-24 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[280px] overflow-hidden rounded-3xl md:h-[380px]">
            <Image
              src="/images/about-culture.avif"
              alt="Synox team culture"
              fill
              className="object-cover"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-Euclid text-3xl font-bold text-black md:text-5xl">
              A culture where teamwork makes the dream work.
            </h2>

            <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
              At Synox, we believe great products come from great teams. We
              value collaboration, learning, accountability, and creating an
              environment where every voice can contribute.
            </p>

            <p className="mt-5 font-Euclid text-lg leading-8 text-gray-600">
              We support growth, celebrate different perspectives, and build
              with a shared mission: helping people bank with more confidence.
            </p>

            <Link
              href="/careers"
              className="mt-8 inline-flex rounded-full bg-black px-8 py-4 font-Euclid font-semibold text-white hover:bg-gray-800"
            >
              Explore our Career
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}