import Login from '@/components/auth/Login'
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading login...
        </div>
      }
    >
      <Login />
    </Suspense>
  )
}
