"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, UserPlus, LogIn, Building2 } from "lucide-react";

type Tab = "login" | "register";

interface AuthFormProps {
  onAuthenticated: (email: string) => void;
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [tab, setTab] = useState<Tab>("register");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { business_name: businessName },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.session) {
          onAuthenticated(email);
        } else {
          setConfirmationSent(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        onAuthenticated(email);
      }
    } finally {
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Check your email</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account, then come back here.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setConfirmationSent(false);
            setTab("login");
          }}
        >
          I confirmed my email — Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-border bg-muted/40 p-1">
        {(["register", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              tab === t
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "register" ? (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Create account
              </>
            ) : (
              <>
                <LogIn className="h-3.5 w-3.5" />
                Log in
              </>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {tab === "register" && (
          <div className="space-y-1.5">
            <label htmlFor="auth-business" className="text-sm font-medium text-foreground">
              Business name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="auth-business"
                type="text"
                placeholder="My Restaurant, My Salon..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-email"
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="auth-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-password"
              type="password"
              placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          ) : tab === "register" ? (
            "Create my account"
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </div>
  );
}
