import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/server";
import { sendMail } from "@/lib/mailer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, account_status")
      .eq("id", user.id)
      .single();

    if (profile?.account_status === "restricted") {
      return NextResponse.json(
        { error: "Your account is restricted. You cannot apply for a card." },
        { status: 403 }
      );
    }

    const { data: kyc } = await supabaseAdmin
      .from("kyc_verifications")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!kyc || kyc.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Your account must be verified before you can apply for a Synox Debit Card.",
        },
        { status: 403 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("card_applications")
      .select("id, status")
      .eq("user_id", user.id)
      .in("status", ["pending", "approved"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.status === "pending"
              ? "You already have a pending card application."
              : "You already have an approved card application.",
        },
        { status: 400 }
      );
    }

    const { data: account } = await supabaseAdmin
      .from("accounts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { error: insertError } = await supabaseAdmin
      .from("card_applications")
      .insert({
        user_id: user.id,
        account_id: account?.id || null,
        card_type: "debit",
        card_name: "Synox Debit Card",
        status: "pending",
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    let emailWarning = "";

    try {
      if (profile?.email) {
        await sendMail({
          to: profile.email,
          subject: "Your Synox Debit Card Application Has Been Received",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Card Application Received</h2>

              <p>Hello ${profile?.full_name || "Customer"},</p>

              <p>Thank you for applying for a Synox Debit Card.</p>

              <p>
                We have received your card request and our team is reviewing your
                application. You will be notified by email once a decision has been made.
              </p>

              <p>
                If approved, your Synox Debit Card will be prepared for delivery to your
                registered address.
              </p>

              <br />

              <p>Thank you for choosing Synox.</p>
              <p style="font-weight: bold;">— Synox Team</p>
            </div>
          `,
        });
      }
    } catch (emailError: any) {
      console.error("Card application email failed:", emailError?.message);
      emailWarning = "Application submitted, but email notification failed.";
    }

    return NextResponse.json({
      success: true,
      emailWarning,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}