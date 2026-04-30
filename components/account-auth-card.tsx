"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

export function AccountAuthCard() {
  const router = useRouter();

  return (
    <AuthForm
      onAuthenticated={() => {
        router.refresh();
      }}
    />
  );
}
