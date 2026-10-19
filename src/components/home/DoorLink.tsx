"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** The call to action on a homepage door card; reports which door was picked. */
export function DoorLink({
  door,
  href,
  className,
  children,
}: {
  door: "lessons" | "studio";
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={() => trackEvent("Door Clicked", { door })} className={className}>
      {children}
    </Link>
  );
}
