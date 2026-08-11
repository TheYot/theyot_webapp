import Image from "next/image";
import { ASSETS } from "@/lib/assets";

type YotLogoProps = {
  variant?: "wordmark" | "mark";
  /** `brand` recolors the silver mark for light page backgrounds. */
  tone?: "default" | "brand";
  className?: string;
  priority?: boolean;
};

const VARIANT_CONFIG = {
  wordmark: {
    src: ASSETS.logos.wordmark,
    alt: "The YOT",
    width: 1039,
    height: 528,
    sizes: "(max-width: 640px) 78vw, (max-width: 1024px) 420px, 480px",
  },
  mark: {
    src: ASSETS.logos.mark,
    alt: "The YOT",
    width: 220,
    height: 205,
    sizes: "(max-width: 640px) 64px, 80px",
  },
} as const;

export function YotLogo({
  variant = "wordmark",
  tone = "default",
  className = "",
  priority = false,
}: YotLogoProps) {
  const config = VARIANT_CONFIG[variant];
  const toneClass =
    variant === "mark" && tone === "brand" ? "yot-logo-mark-brand" : "";

  return (
    <Image
      src={config.src}
      alt={config.alt}
      width={config.width}
      height={config.height}
      sizes={config.sizes}
      priority={priority}
      className={`object-contain ${toneClass} ${className}`.trim()}
    />
  );
}
