import type { ReactNode } from "react";
import { QrGlyph } from "@/components/scan/QrGlyph";

type ScanViewfinderProps = {
  children?: ReactNode;
  showGlyph?: boolean;
};

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-20 h-9 w-9 border-white sm:h-11 sm:w-11 ${className}`}
    />
  );
}

export function ScanViewfinder({
  children,
  showGlyph = true,
}: ScanViewfinderProps) {
  return (
    <div className="relative mx-auto aspect-square w-[min(72vw,19.5rem)] sm:w-[min(58vw,22rem)] md:w-[24rem]">
      <Corner className="top-0 left-0 rounded-tl-[1.15rem] border-t-[3px] border-l-[3px]" />
      <Corner className="top-0 right-0 rounded-tr-[1.15rem] border-t-[3px] border-r-[3px]" />
      <Corner className="bottom-0 left-0 rounded-bl-[1.15rem] border-b-[3px] border-l-[3px]" />
      <Corner className="right-0 bottom-0 rounded-br-[1.15rem] border-r-[3px] border-b-[3px]" />

      <div className="scan-glass absolute inset-[0.85rem] overflow-hidden rounded-[1.35rem] sm:inset-4 sm:rounded-3xl">
        {children}

        {showGlyph ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <QrGlyph className="h-10 w-10 text-white/55 sm:h-11 sm:w-11" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
