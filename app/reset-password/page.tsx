import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — Iconrev",
  description: "Choose a new password for your Iconrev account.",
};

export default function ResetPasswordPage() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Reset your password
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a new password for your Iconrev account.
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
