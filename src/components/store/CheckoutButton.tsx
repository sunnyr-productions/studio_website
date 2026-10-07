"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export function CheckoutButton({ productSlug }: { productSlug: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    trackEvent("Checkout Started", { product: productSlug });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <Button variant="primary" onClick={handleClick} disabled={status === "loading"}>
        {status === "loading" ? "Redirecting…" : "Buy Now"}
      </Button>
      {status === "error" && (
        <p className="animate-fade-up mt-2 text-sm text-red-700">
          Checkout isn&apos;t available right now — please try again shortly.
        </p>
      )}
    </div>
  );
}
