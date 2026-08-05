// design-sync-only variant of src/components/ui/Button.tsx.
// Swaps next/link's <Link> for a plain <a> — next/link pulls in Next.js
// internals that reference Node-only `process.env.*` globals, which crash
// when bundled standalone for claude.ai/design. Visual output is identical;
// production Button.tsx (with real client-side navigation) is untouched.
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-marigold-500 text-ink-900 hover:bg-marigold-400 focus-visible:outline-marigold-700",
  secondary:
    "bg-transparent text-periwinkle-700 border-2 border-periwinkle-400 hover:bg-periwinkle-50 focus-visible:outline-periwinkle-600",
  ghost:
    "bg-transparent text-ink-700 hover:bg-cream-200 focus-visible:outline-ink-700",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

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

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
