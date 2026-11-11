import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

// Drawn like the scenery: ink outline and cartoon shading, a sunlit marigold and
// a cloud-white second choice (.btn-primary and .btn-secondary in globals.css).
const variantClasses: Record<Variant, string> = {
  primary: "btn-primary focus-visible:outline-marigold-700",
  secondary: "btn-secondary focus-visible:outline-periwinkle-600",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  const style = { borderRadius: "var(--radius-sketch-pill)" };

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} style={style} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} style={style} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button style={style} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
