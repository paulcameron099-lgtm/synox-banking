import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/login?confirmed=true", requestUrl.origin));
}