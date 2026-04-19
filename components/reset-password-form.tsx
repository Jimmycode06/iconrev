"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setRecoveryReady(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setRecoveryReady(true);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Password updated
        </h3>
        <p className="text-sm text-muted-foreground">
          You&apos;re all set. Redirecting you back to the homepage...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!recoveryReady && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
          If you opened this page directly, please use the reset link sent to
          your email.
        </p>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="new-password"
          className="text-sm font-medium text-foreground"
        >
          New password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="new-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-foreground"
        >
          Confirm new password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-9"
            required
            minLength={6}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-500/95 hover:via-blue-500/95 hover:to-cyan-500/95 text-white h-11"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Update my password"
        )}
      </Button>
    </form>
  );
}
