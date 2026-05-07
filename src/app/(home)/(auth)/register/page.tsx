import Register from "@/components/auth/Register";
import { Suspense } from "react";
// import RegisterForm from "./RegisterForm";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading registration...
        </div>
      }
    >
      <Register />
    </Suspense>
  );
}