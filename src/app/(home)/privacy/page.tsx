const privacyItems = [
  {
    title: "Information we collect",
    text: "We may collect information you provide when creating an account, contacting support, applying for services, using direct deposit tools, or interacting with Synox online.",
  },
  {
    title: "How we use information",
    text: "We use information to create and manage accounts, process transactions, improve our services, provide customer support, detect fraud, and keep Synox secure.",
  },
  {
    title: "Security and fraud protection",
    text: "Synox may use account alerts, monitoring tools, verification checks, and security reviews to help protect customers from unauthorized activity.",
  },
  {
    title: "Sharing information",
    text: "We do not sell personal information. We may share information with trusted service providers, regulatory bodies, payment processors, or security partners when needed to operate our services.",
  },
  {
    title: "Cookies and website data",
    text: "Our website may use cookies or similar tools to improve performance, understand usage, remember preferences, and provide a better digital experience.",
  },
  {
    title: "Your choices",
    text: "You may update certain account information, manage communication preferences, or contact Synox support for privacy-related questions.",
  },
  {
    title: "Policy updates",
    text: "We may update this Privacy Policy as our services grow. Any important changes will be reflected on this page.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="w-full bg-white px-5 pb-24 pt-36 md:px-10 lg:px-20">
      <section className="mx-auto max-w-5xl">
        <p className="font-Euclid text-lg font-semibold text-yellow-600">
          Privacy
        </p>

        <h1 className="mt-4 font-Euclid text-4xl font-bold text-black md:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-6 font-Euclid text-lg leading-8 text-gray-600">
          Your trust matters to us. This Privacy Policy explains how Synox may
          collect, use, protect, and share information when you use our website,
          accounts, and digital banking services.
        </p>

        <div className="mt-12 space-y-6">
          {privacyItems.map((item) => (
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