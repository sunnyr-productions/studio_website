import Image from "next/image";
import logoSrc from "../../../public/images/sunnyr-logo.svg";

type LogoProps = {
  className?: string;
};

/**
 * The sunny*r Studio ambigram wordmark — reads identically rotated 180°.
 * Vector artwork (public/images/sunnyr-logo.svg, ~3:2). Size it with a height
 * utility on `className` (e.g. `h-14 w-auto`); the intrinsic viewBox keeps the
 * aspect ratio. Next serves .svg unoptimized automatically.
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
