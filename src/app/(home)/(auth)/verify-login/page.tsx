import { Suspense } from "react";
import VerifyLoginForm from "@/components/auth/VerifyLoginForm";

export default function VerifyLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyLoginForm />
    </Suspense>
  );
}