"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { trackEvent } from "@/lib/analytics";

export function CalEmbed({ calLink }: { calLink: string }) {
  // Report confirmed bookings as a conversion. Registered once; the embed
  // fires this after the visitor completes a booking inside it.
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: (e) => {
          trackEvent("Lesson Booked", { event: e.detail.data.title ?? calLink });
        },
      });
    })();
  }, [calLink]);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#f5a623" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
      config={{ layout: "month_view" }}
    />
  );
}
