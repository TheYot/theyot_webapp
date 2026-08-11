import Image from "next/image";
import { YotLogo } from "@/components/branding/YotLogo";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/assets";

type ScanSuccessScreenProps = {
  tableId?: string;
};

export function ScanSuccessScreen({ tableId = "12" }: ScanSuccessScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-5 py-4 sm:px-8 sm:py-6 md:px-12">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col sm:max-w-lg">
        <header className="scan-enter shrink-0">
          <YotLogo
            variant="mark"
            tone="brand"
            className="h-10 w-10 sm:h-12 sm:w-12"
            priority
          />
        </header>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 py-4 text-center sm:gap-6 sm:py-6">
          <div className="scan-enter-delay relative w-28 shrink-0 sm:w-40 md:w-48">
            <Image
              src={ASSETS.scan.success}
              alt="Scan successful"
              width={222}
              height={229}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="scan-enter-delay-2 space-y-2 px-1 sm:space-y-3">
            <h1 className="text-2xl leading-tight font-bold tracking-tight text-main sm:text-3xl">
              Welcome to The YOT!
            </h1>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-main/55 sm:max-w-sm sm:text-base">
              Your table is ready. Let’s begin your dining experience with us.
            </p>
          </div>
        </div>

        <div className="scan-enter-delay-2 flex shrink-0 justify-center pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-6">
          <Button
            href={`/menu?table=${encodeURIComponent(tableId)}`}
            variant="main"
            className="max-w-[18.5rem] sm:max-w-[20rem]"
          >
            Continue to our menu
          </Button>
        </div>
      </div>
    </main>
  );
}
