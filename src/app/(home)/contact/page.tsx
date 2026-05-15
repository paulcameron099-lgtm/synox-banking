"use client";

import Image from "next/image";
import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const form = e.currentTarget;

  const formData = new FormData(form);

  const payload = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  setLoading(false);

  if (!res.ok) {
    alert(data?.error || "Message failed to send.");
    return;
  }

  alert("Message sent successfully.");
  form.reset();
};

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12 lg:px-8 mt-28">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative hidden min-h-[650px] bg-zinc-900 lg:block">
          <div className="absolute inset-0 z-10 bg-linear-to-br from-zinc-900/75 via-zinc-900/35 to-zinc-900/70" />

          <Image
            src="/images/contact-image.avif"
            alt="Synox support"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 z-20 p-10 text-white">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <h2 className="text-3xl font-bold">Talk to Synox</h2>
              <p className="mt-3 text-sm leading-6 text-gray-100">
                Need help with your account, verification, transfer, withdrawal,
                card request, or security concern? Our support team is ready to
                help.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Contact Us
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              How can we help?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Send us a message and the Synox team will get back to you as soon
              as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Topic
                  </label>
                  <select required className={inputClass} name="topic">
                    <option value="">Select topic</option>
                    <option value="account">Account Support</option>
                    <option value="kyc">KYC Verification</option>
                    <option value="transfer">Transfers</option>
                    <option value="card">Debit Card</option>
                    <option value="security">Security Concern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Enter message subject"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-medium text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-8 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">Email</p>
                <p className="mt-1 text-sm text-gray-500">
                  support@synox.com
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">Support</p>
                <p className="mt-1 text-sm text-gray-500">
                  Mon–Fri, 9:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}