"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackAnalyticsEvent("page_view", {
      query: searchParams.toString() || null,
      title: document.title || null,
    });
  }, [pathname, searchParams]);

  return null;
}
