"use client";

export default function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 9V3H18V9H20C21.1046 9 22 9.89543 22 11V16H18V21H6V16H2V11C2 9.89543 2.89543 9 4 9H6ZM8 5V9H16V5H8ZM8 19H16V13H8V19ZM20 14V11H4V14H6V11H18V14H20Z" />
      </svg>
      Print Receipt
    </button>
  );
}