import { ResetPasswordForm } from "@/components/reset-password-form";
import { getTranslations } from "next-intl/server";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ResetPassword" });

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("desc")}
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
