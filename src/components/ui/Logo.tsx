import Image from "next/image";
import logoSrc from "../../../public/images/sunnyr-logo-cropped.png";

type LogoProps = {
  className?: string;
};

/**
 * The sunny*r Studio ambigram wordmark — reads identically rotated 180°.
 * Renders the hand-illustrated artwork (public/images/sunnyr-logo.png).
 * Size it with a height utility on `className` (e.g. `h-14 w-auto`); the
 * intrinsic 1:1 dimensions keep the aspect ratio.
 */
export function Logo({ className = "" }: LogoProps) {
  return (
    <Image
      src={logoSrc}
      alt="The sunny*r Studio"
      priority
      className={`logo-mark ${className}`}
    />
  );
}
