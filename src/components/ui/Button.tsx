import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// Same flat "sticker" shadow language as Card — an ink-outlined shape with a
// solid offset shadow that grows on hover and flattens on press, instead of
// a soft-blur pill button.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-marigold-500 text-[color:var(--color-ink-fixed)] border-[1.5px] border-[color:var(--color-ink-fixed)] shadow-[3px_4px_0_0_var(--color-ink-fixed)] motion-safe:hover:shadow-[4px_5px_0_0_var(--color-ink-fixed)] hover:bg-marigold-400 focus-visible:outline-marigold-700",
  secondary:
    "bg-cream-50 text-periwinkle-700 border-[1.5px] border-periwinkle-500 shadow-[3px_4px_0_0_var(--color-periwinkle-300)] motion-safe:hover:shadow-[4px_5px_0_0_var(--color-periwinkle-300)] hover:bg-periwinkle-50 focus-visible:outline-periwinkle-600",
  ghost: "bg-transparent text-ink-700 hover:bg-cream-200 focus-visible:outline-ink-700",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:-translate-x-0.5 motion-safe:active:translate-y-0 motion-safe:active:translate-x-0 motion-safe:active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

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
