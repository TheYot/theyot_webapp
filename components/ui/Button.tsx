import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "accent" | "outline";
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_STYLES = {
  accent: "btn-accent text-white",
  outline:
    "border border-accent/70 bg-transparent text-accent hover:bg-accent/10 active:bg-accent/15",
} as const;

const BASE_STYLES =
  "inline-flex h-12 w-full max-w-[16.5rem] items-center justify-center rounded-full px-10 text-center text-[0.95rem] font-semibold tracking-wide transition-[filter,transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main active:scale-[0.98] sm:h-[3.25rem] sm:max-w-[18rem] sm:text-base";

export function Button({
  children,
  className = "",
  variant = "accent",
  ...props
}: ButtonProps) {
  const classes = `${BASE_STYLES} ${VARIANT_STYLES[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
