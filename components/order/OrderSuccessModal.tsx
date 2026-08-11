"use client";

import Image from "next/image";
import { YotLogo } from "@/components/branding/YotLogo";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/assets";

type OrderSuccessModalProps = {
  open: boolean;
  mealName: string;
  quantity: number;
  onContinue: () => void;
};

export function OrderSuccessModal({
  open,
  mealName,
  quantity,
  onContinue,
}: OrderSuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-main/45 px-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
    >
      <div className="scan-enter w-full max-w-sm rounded-[1.75rem] border border-main/10 bg-white px-6 pt-6 pb-7 text-center sm:max-w-md sm:px-8 sm:pb-8">
        <div className="flex justify-center">
          <YotLogo
            variant="mark"
            tone="brand"
            className="h-12 w-12 sm:h-14 sm:w-14"
            priority
          />
        </div>

        <div className="mx-auto mt-5 w-28 sm:mt-6 sm:w-32">
          <Image
            src={ASSETS.scan.success}
            alt=""
            width={222}
            height={229}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <h2
          id="order-success-title"
          className="mt-5 text-xl font-bold tracking-tight text-main sm:text-2xl"
        >
          Order placed successfully!
        </h2>
        <p className="mx-auto mt-2 max-w-[16.5rem] text-sm leading-relaxed text-main/55 sm:max-w-xs sm:text-[0.95rem]">
          {quantity > 1 ? `${quantity}× ` : ""}
          {mealName} is on its way to the kitchen. Track your order live.
        </p>

        <div className="mt-7 flex justify-center">
          <Button
            type="button"
            variant="main"
            className="max-w-[15rem]"
            onClick={onContinue}
          >
            Track my order
          </Button>
        </div>
      </div>
    </div>
  );
}
