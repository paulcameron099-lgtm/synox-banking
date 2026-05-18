import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/mailer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const code = generateCode();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await supabaseAdmin
      .from("login_verifications")
      .delete()
      .eq("user_id", userId);

    const { error } = await supabaseAdmin
      .from("login_verifications")
      .insert({
        user_id: userId,
        email,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    await sendMail({
      to: email,
      subject: "Your Synox Login Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.7; color:#111827;">
          <h2>Login Verification Required</h2>

          <p>
            We detected a new login attempt to your Synox account.
          </p>

          <p>
            Please use the secure verification code below to continue signing in:
          </p>

          <div style="margin:30px 0; text-align:center;">
            <div
              style="
                display:inline-block;
                padding:18px 32px;
                background:#111827;
                color:#ffffff;
                font-size:32px;
                font-weight:bold;
                border-radius:12px;
                letter-spacing:8px;
              "
            >
              ${code}
            </div>
          </div>

          <p>
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not attempt to sign in to your account,
            please secure your account immediately by changing your password.
          </p>

          <br />

          <p>
            Thank you for choosing Synox.
          </p>

          <p style="font-weight:bold;">
            — Synox Security Team
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Server error.",
      },
      {
        status: 500,
      }
    );
  }
}