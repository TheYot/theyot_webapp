type ScanStatusProps = {
  label: string;
  tone?: "scanning" | "ready" | "error";
};

const DOT_STYLES = {
  scanning: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.75)]",
  ready: "bg-accent",
  error: "bg-red-400",
} as const;

export function ScanStatus({ label, tone = "scanning" }: ScanStatusProps) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full bg-black/35 px-4 py-2.5 backdrop-blur-[2px]">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {tone === "scanning" ? (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70"
          />
        ) : null}
        <span
          aria-hidden
          className={`relative h-2.5 w-2.5 rounded-full ${DOT_STYLES[tone]}`}
        />
      </span>
      <span className="text-sm font-medium tracking-wide text-white sm:text-[0.95rem]">
        {label}
      </span>
    </div>
  );
}
