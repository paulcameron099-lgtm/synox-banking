import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/mailer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      passportPhotoPath,
      driversLicenseFrontPath,
      driversLicenseBackPath,
      ssnFrontPath,
      ssnBackPath,
    } = body;

    if (
      !passportPhotoPath ||
      !driversLicenseFrontPath ||
      !driversLicenseBackPath ||
      !ssnFrontPath ||
      !ssnBackPath
    ) {
      return NextResponse.json(
        { error: "All KYC documents are required." },
        { status: 400 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", user.id)
      .single();

    const { error: insertError } = await supabaseAdmin
      .from("kyc_verifications")
      .insert({
        user_id: user.id,
        passport_photo_url: passportPhotoPath,
        drivers_license_front_url: driversLicenseFrontPath,
        drivers_license_back_url: driversLicenseBackPath,
        ssn_front_url: ssnFrontPath,
        ssn_back_url: ssnBackPath,
        status: "processing",
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const companyEmail = process.env.COMPANY_KYC_EMAIL!;

    try {
       await Promise.all([
      sendMail({
        to: companyEmail,
        subject: "New KYC Verification Submission - Synox",
        html: `
          <h2>New KYC Submission</h2>
          <p>A user has submitted KYC documents for review.</p>
          <p><strong>Name:</strong> ${profile?.full_name || "Unknown"}</p>
          <p><strong>Email:</strong> ${profile?.email || user.email}</p>
          <p><strong>Phone:</strong> ${profile?.phone || "Not provided"}</p>
          <p><strong>User ID:</strong> ${user.id}</p>
          <hr />
          <p><strong>Passport Photo Path:</strong> ${passportPhotoPath}</p>
          <p><strong>Driver License Front Path:</strong> ${driversLicenseFrontPath}</p>
          <p><strong>Driver License Back Path:</strong> ${driversLicenseBackPath}</p>
          <p><strong>SSN Front Path:</strong> ${ssnFrontPath}</p>
          <p><strong>SSN Back Path:</strong> ${ssnBackPath}</p>
          <p>Please review this submission in the admin dashboard.</p>
        `,
      }),

      sendMail({
        to: profile?.email || user.email || "",
        subject: "Your Synox Verification Is Being Reviewed",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Verification Request Received</h2>
            <p>Hello ${profile?.full_name || "Customer"},</p>
            <p>Your Synox verification request has been received successfully.</p>
            <p>Our compliance team is currently reviewing your submitted documents. This usually takes less than 24 hours.</p>
            <p>We will notify you by email once your account verification is complete.</p>
            <br />
            <p>Thank you for choosing Synox.</p>
          </div>
        `,
      }),
    ]);
    } catch (emailError: any) {
      console.error("KYC email failed:", emailError?.message);
    }

   

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}