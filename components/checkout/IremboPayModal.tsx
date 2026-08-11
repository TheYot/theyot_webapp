"use client";

import { useState } from "react";
import { CreditCard, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/billing";

type PayMethod = "mtn" | "airtel" | "card";

type IremboPayModalProps = {
  open: boolean;
  amountRwf: number;
  invoiceNumber: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function IremboPayModal({
  open,
  amountRwf,
  invoiceNumber,
  onClose,
  onSuccess,
}: IremboPayModalProps) {
  const [method, setMethod] = useState<PayMethod>("mtn");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const pay = () => {
    setError("");

    if (method === "mtn" || method === "airtel") {
      if (!/^07\d{8}$/.test(phone.replace(/\s/g, ""))) {
        setError("Enter a valid Rwandan mobile number (07XXXXXXXX).");
        return;
      }
    } else {
      if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 15 || !expiry || cvv.length < 3) {
        setError("Fill in complete card details to continue.");
        return;
      }
    }

    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 px-3 py-3 backdrop-blur-[1px] sm:items-center sm:px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="irembopay-title"
    >
      <div className="scan-enter max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[1.25rem] border border-main/10 bg-white">
        <div className="flex items-center justify-between border-b border-main/10 px-4 py-3.5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#0B8F4F] uppercase">
              IremboPay
            </p>
            <h2 id="irembopay-title" className="text-base font-bold text-main">
              Complete payment
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-main/10 text-main"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-xl border border-main/10 bg-background px-4 py-3">
            <p className="text-xs text-main/50">Invoice</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="font-mono text-sm font-semibold text-main">
                {invoiceNumber}
              </p>
              <p className="text-lg font-bold text-[#0B8F4F]">
                {formatMoney(amountRwf)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-main">
              Choose payment method
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "mtn", label: "MTN MoMo", tone: "bg-[#FFCC00] text-main" },
                  { id: "airtel", label: "Airtel", tone: "bg-[#ED1C24] text-white" },
                  { id: "card", label: "Card", tone: "bg-[#1A56DB] text-white" },
                ] as const
              ).map((option) => {
                const active = method === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMethod(option.id)}
                    className={[
                      "cursor-pointer rounded-xl border px-2 py-3 text-center transition",
                      active
                        ? "border-[#0B8F4F] bg-[#0B8F4F]/8"
                        : "border-main/10 bg-white hover:bg-background",
                    ].join(" ")}
                  >
                    <span
                      className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${option.tone}`}
                    >
                      {option.id === "card" ? (
                        <CreditCard className="h-4 w-4" />
                      ) : (
                        <Smartphone className="h-4 w-4" />
                      )}
                    </span>
                    <span className="block text-[11px] font-semibold text-main">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {method === "card" ? (
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-main/55">
                  Cardholder name
                </span>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Isano Tyrion"
                  className="h-11 w-full rounded-xl border border-main/15 bg-background px-3 text-sm outline-none focus:border-[#0B8F4F]"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-main/55">
                  Card number
                </span>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  className="h-11 w-full rounded-xl border border-main/15 bg-background px-3 text-sm outline-none focus:border-[#0B8F4F]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-main/55">
                    Expiry
                  </span>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="01/35"
                    className="h-11 w-full rounded-xl border border-main/15 bg-background px-3 text-sm outline-none focus:border-[#0B8F4F]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-main/55">
                    CVV
                  </span>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    inputMode="numeric"
                    className="h-11 w-full rounded-xl border border-main/15 bg-background px-3 text-sm outline-none focus:border-[#0B8F4F]"
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-main/55">
                {method === "mtn" ? "MTN MoMo number" : "Airtel Money number"}
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={method === "mtn" ? "0781234567" : "0731234567"}
                inputMode="tel"
                className="h-11 w-full rounded-xl border border-main/15 bg-background px-3 text-sm outline-none focus:border-[#0B8F4F]"
              />
              <span className="mt-1.5 block text-[11px] text-main/45">
                Demo tip: use {method === "mtn" ? "0781234567" : "0731234567"} for
                success
              </span>
            </label>
          )}

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            variant="main"
            className="max-w-none w-full border-[#0B8F4F] bg-[#0B8F4F] hover:bg-[#097a43]"
            onClick={pay}
            disabled={busy}
          >
            {busy ? "Processing..." : `Pay ${formatMoney(amountRwf)}`}
          </Button>

          <p className="pb-1 text-center text-[11px] leading-relaxed text-main/45">
            Secured by IremboPay · MTN MoMo, Airtel Money & Cards
          </p>
        </div>
      </div>
    </div>
  );
}
