import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { randomBytes } from "crypto";

// In-memory OTP store (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

// Generate secure 6-digit OTP using crypto
function generateOTP(): string {
  const num = randomBytes(3).readUIntBE(0, 3) % 1000000;
  return num.toString().padStart(6, "0");
}

// Send OTP via Email using Resend API
async function sendEmailOTP(email: string, otp: string, name: string): Promise<{ success: boolean; devMode?: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    // Development mode - log OTP to console
    if (!apiKey || apiKey === "your_resend_api_key") {
      console.log(`\n📧 [DEV MODE] Email OTP to ${email}: ${otp}\n`);
      return { success: true, devMode: true };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "PLUGG <onboarding@resend.dev>",
        to: [email],
        subject: "Your PLUGG Login Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">PLUGG</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Hyperlocal Electronics Marketplace</p>
            </div>
            <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Your verification code is:</p>
              <div style="background: #f3f4f6; padding: 30px; text-align: center; border-radius: 8px; margin: 25px 0;">
                <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #2563eb; font-family: monospace;">${otp}</span>
              </div>
              <p style="color: #6b7280; font-size: 14px;">This code will expire in <strong>5 minutes</strong>.</p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                If you didn't request this code, please ignore this email.<br>
                Do not share this code with anyone.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      
      // Check if it's a domain verification error (free tier limitation)
      if (errorData.message?.includes("testing emails to your own email address")) {
        console.log(`\n📧 [DEV MODE - Free Tier] Email OTP to ${email}: ${otp}\n`);
        console.log("Note: Resend free tier only allows sending to your own email. OTP shown above.\n");
        return { success: true, devMode: true };
      }
      
      return { success: false, error: errorData.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Email OTP error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export const otpRouter = createTRPCRouter({
  // Send OTP via Email
  sendOTP: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        fullName: z.string().min(2),
        purpose: z.enum(["LOGIN", "REGISTER", "RESET_PASSWORD"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, fullName, purpose } = input;
      
      // Generate OTP
      const otp = generateOTP();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
      
      // Store OTP with email as key
      otpStore.set(email, { otp, expires, attempts: 0 });
      
      // Send via email
      const result = await sendEmailOTP(email, otp, fullName);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send OTP. Please try again.");
      }
      
      // Check if we're in development/free tier mode
      const isDevMode = result.devMode || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key";
      
      return {
        success: true,
        message: isDevMode 
          ? `Development Mode - Your OTP is: ${otp}`
          : `OTP sent to ${email}`,
        // Show OTP in dev mode for testing
        ...(isDevMode && { otp }),
      };
    }),

  // Verify OTP
  verifyOTP: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6, "OTP must be 6 digits"),
      })
    )
    .mutation(async ({ input }) => {
      const { email, otp } = input;
      
      const stored = otpStore.get(email);
      
      if (!stored) {
        throw new Error("OTP not found. Please request a new OTP.");
      }
      
      if (Date.now() > stored.expires) {
        otpStore.delete(email);
        throw new Error("OTP expired. Please request a new OTP.");
      }
      
      // Increment attempts
      stored.attempts += 1;
      if (stored.attempts > 3) {
        otpStore.delete(email);
        throw new Error("Too many failed attempts. Please request a new OTP.");
      }
      
      if (stored.otp !== otp) {
        throw new Error(`Invalid OTP. ${3 - stored.attempts} attempts remaining.`);
      }
      
      // Clear OTP after successful verification
      otpStore.delete(email);
      
      return { success: true, message: "OTP verified successfully" };
    }),

  // Resend OTP
  resendOTP: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, fullName } = input;
      
      // Check if recently sent (rate limiting - 1 minute)
      const stored = otpStore.get(email);
      if (stored && Date.now() < stored.expires - 4 * 60 * 1000) {
        throw new Error("Please wait 1 minute before requesting a new OTP");
      }
      
      const otp = generateOTP();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      otpStore.set(email, { otp, expires, attempts: 0 });
      
      const result = await sendEmailOTP(email, otp, fullName);
      
      const isDevMode = result.devMode || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key";
      
      return {
        success: true,
        message: isDevMode ? `Development Mode - Your OTP is: ${otp}` : `OTP resent to ${email}`,
        ...(isDevMode && { otp }),
      };
    }),
});
