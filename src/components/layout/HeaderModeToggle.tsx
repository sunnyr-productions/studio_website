"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ui/ModeToggle";

/**
 * The header's copy of the door switch. On the homepage the hero already
 * presents the chooser prominently, so showing it again in the header reads as
 * redundant — hide it there and let the hero be the single chooser. On every
 * other page the header toggle is how visitors switch doors, so it stays.
 */
export function HeaderModeToggle() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <ModeToggle compact className="hidden lg:inline-flex" />;
}
