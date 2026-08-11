import {
  ChefHat,
  CookingPot,
  HandPlatter,
  Package,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type OrderStepId =
  | "ordered"
  | "received"
  | "preparing"
  | "ready"
  | "served";

type OrderStep = {
  id: OrderStepId;
  label: string;
  icon: LucideIcon;
  side: "left" | "right" | "center";
};

const STEPS: OrderStep[] = [
  { id: "ordered", label: "Ordered", icon: ChefHat, side: "right" },
  { id: "received", label: "Received", icon: Package, side: "left" },
  { id: "preparing", label: "Preparing", icon: CookingPot, side: "right" },
  { id: "ready", label: "Ready", icon: UtensilsCrossed, side: "left" },
  { id: "served", label: "Served", icon: HandPlatter, side: "center" },
];

const STEP_ORDER: OrderStepId[] = [
  "ordered",
  "received",
  "preparing",
  "ready",
  "served",
];

type OrderTimelineProps = {
  activeStep?: OrderStepId;
};

export function OrderTimeline({ activeStep = "received" }: OrderTimelineProps) {
  const activeIndex = STEP_ORDER.indexOf(activeStep);

  return (
    <div className="relative mx-auto w-full max-w-sm py-2">
      <div
        aria-hidden
        className="absolute top-8 bottom-10 left-1/2 w-px -translate-x-1/2 bg-main/15"
      />

      <ol className="relative space-y-8">
        {STEPS.map((step, index) => {
          const done = index <= activeIndex;
          const Icon = step.icon;
          const isCenter = step.side === "center";

          return (
            <li key={step.id} className="relative flex min-h-14 items-center">
              <span
                aria-hidden
                className={[
                  "absolute top-1/2 left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                  done
                    ? "border-main bg-main"
                    : "border-main/25 bg-background",
                ].join(" ")}
              />

              {!isCenter ? (
                <span
                  aria-hidden
                  className={[
                    "absolute top-1/2 h-px w-[18%] -translate-y-1/2",
                    step.side === "left"
                      ? "right-1/2 mr-1.5"
                      : "left-1/2 ml-1.5",
                    done ? "bg-main" : "bg-main/20",
                  ].join(" ")}
                />
              ) : null}

              <div
                className={[
                  "flex w-[42%] flex-col items-center gap-1.5",
                  isCenter
                    ? "mx-auto"
                    : step.side === "left"
                      ? "mr-auto"
                      : "ml-auto",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex h-11 w-11 items-center justify-center rounded-full border",
                    done
                      ? "border-main bg-main text-white"
                      : "border-main/15 bg-white text-main/35",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span
                  className={[
                    "text-xs font-semibold sm:text-sm",
                    done ? "text-main" : "text-main/35",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
