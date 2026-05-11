const terms = [
  {
    title: "Use of Synox services",
    text: "By using Synox, you agree to use our banking, account, payment, and digital tools responsibly and only for lawful purposes.",
  },
  {
    title: "Account information",
    text: "You are responsible for providing accurate information when opening or managing an account. This may include your name, contact details, identity information, and other details required to protect your account.",
  },
  {
    title: "Security",
    text: "You are responsible for keeping your login details private. Synox may use fraud monitoring, account alerts, and security checks to help protect your account.",
  },
  {
    title: "Payments and transfers",
    text: "Transfers, deposits, direct deposits, and withdrawals may be subject to processing times, limits, reviews, and verification checks.",
  },
  {
    title: "Fees and rates",
    text: "Synox aims to keep pricing transparent. Rates, APYs, fees, and account features may change, and we will display important updates where required.",
  },
  {
    title: "Changes to these terms",
    text: "We may update these Terms and Conditions when needed. Continued use of Synox after updates means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="w-full bg-white px-5 pb-24 pt-36 md:px-10 lg:px-20">
      <section className="mx-auto max-w-5xl">
        <p className="font-Euclid text-lg font-semibold text-yellow-600">
          Legal
        </p>

        <h1 className="mt-4 font-Euclid text-4xl font-bold text-black md:text-4xl">
          Terms & Conditions
        </h1>

        <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
          These terms explain how you may use Synox Bank services, website
          features, and digital banking tools. Please review them carefully
          before using our platform.
        </p>

        <div className="mt-12 space-y-6">
          {terms.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="font-Euclid text-2xl font-bold text-black">
                {item.title}
              </h2>

              <p className="mt-4 font-Euclid leading-8 text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}