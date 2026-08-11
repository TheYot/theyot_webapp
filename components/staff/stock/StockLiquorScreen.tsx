"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Camera, CheckCircle2, ScanLine, ShieldCheck } from "lucide-react";
import { StaffShell } from "@/components/staff/StaffShell";
import {
  EmptyState,
  Feedback,
  Field,
  FormPanel,
  StatCard,
  TextInput,
  TextSelect,
} from "@/components/staff/stock/StockForm";
import { useStock } from "@/components/staff/stock/StockProvider";

type ScanMode = "intake" | "empty";

export function StockLiquorScreen() {
  const {
    inventory,
    bottles,
    scanBottleIn,
    scanBottleOut,
    ready,
  } = useStock();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<ScanMode>("intake");
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [tagCode, setTagCode] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );

  const liquorItems = useMemo(
    () => inventory.filter((item) => item.isLiquor),
    [inventory],
  );

  useEffect(() => {
    if (!inventoryId && liquorItems[0]) setInventoryId(liquorItems[0].id);
  }, [inventoryId, liquorItems]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  };

  const startCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setCameraError(
        "Camera unavailable. Enter the tag manually or use a demo tag below.",
      );
      setCameraOn(false);
    }
  };

  const simulateScan = (code: string) => {
    setTagCode(code);
    setMessage({
      tone: "ok",
      text: `Captured ${code}. Confirm below to ${mode === "intake" ? "add to stock" : "mark empty"}.`,
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const error =
      mode === "intake"
        ? scanBottleIn(tagCode, inventoryId)
        : scanBottleOut(tagCode);

    if (error) {
      setMessage({ tone: "error", text: error });
      return;
    }

    setMessage({
      tone: "ok",
      text:
        mode === "intake"
          ? `${tagCode.trim().toUpperCase()} registered. Bottle volume added to liquor stock.`
          : `${tagCode.trim().toUpperCase()} verified empty — originality confirmed & marked consumed.`,
    });
    setTagCode("");
  };

  const active = bottles.filter((b) => b.status === "active");
  const destroyed = bottles.filter((b) => b.status === "destroyed");

  return (
    <StaffShell
      title="Liquor scanner"
      subtitle="Scan a sealed tag into stock, then scan the empty bottle later to prove originality."
    >
      {!ready ? (
        <p className="text-sm text-main/45">Loading liquor passports…</p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Active bottles" value={active.length} tone="good" />
            <StatCard label="Emptied & verified" value={destroyed.length} />
            <StatCard label="Liquor SKUs" value={liquorItems.length} />
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-full border border-main/10 bg-white p-1">
            <button
              type="button"
              onClick={() => {
                setMode("intake");
                setMessage(null);
              }}
              className={[
                "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
                mode === "intake"
                  ? "bg-main text-white"
                  : "text-main/50 hover:text-main",
              ].join(" ")}
            >
              <ScanLine className="h-4 w-4" />
              Scan in (stock)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("empty");
                setMessage(null);
              }}
              className={[
                "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
                mode === "empty"
                  ? "bg-main text-white"
                  : "text-main/50 hover:text-main",
              ].join(" ")}
            >
              <ShieldCheck className="h-4 w-4" />
              Scan empty
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="overflow-hidden rounded-2xl border border-main/10 bg-main text-white">
              <div className="relative aspect-4/3 bg-black/30">
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                    <Camera className="h-10 w-10 text-white/70" />
                    <p className="text-sm text-white/70">
                      Point at the bottle passport tag, or use manual / demo entry.
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-40 w-40 rounded-2xl border-2 border-accent/80" />
                </div>
              </div>
              <div className="space-y-3 p-4">
                {cameraError ? (
                  <p className="text-sm text-amber-200">{cameraError}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {cameraOn ? (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold"
                    >
                      Stop camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-accent bg-accent px-4 text-sm font-semibold text-white"
                    >
                      Open camera
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      simulateScan(
                        mode === "intake"
                          ? `YOT-RUM-${Math.floor(1000 + Math.random() * 9000)}`
                          : active[0]?.tagCode ?? "YOT-RUM-1001",
                      )
                    }
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold"
                  >
                    Demo scan
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-white/55">
                  {mode === "intake"
                    ? "Intake: scan a new sealed bottle → tag is registered and volume is added to liquor stock."
                    : "Empty: scan the same tag when the bottle is finished → proves it was an original YOT bottle and marks it consumed."}
                </p>
              </div>
            </section>

            <FormPanel
              title={mode === "intake" ? "Register bottle" : "Verify empty bottle"}
              description={
                mode === "intake"
                  ? "Tag goes into passport stock. Linked liquor SKU gains one bottle volume."
                  : "Only tags previously scanned in can be marked destroyed / consumed."
              }
              footer={
                <button
                  type="submit"
                  form="liquor-form"
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-main bg-main px-6 text-sm font-semibold text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {mode === "intake" ? "Add to stock" : "Confirm empty"}
                </button>
              }
            >
              <form id="liquor-form" onSubmit={onSubmit} className="space-y-4">
                {message ? (
                  <Feedback tone={message.tone} message={message.text} />
                ) : null}
                <Field label="Bottle tag code">
                  <TextInput
                    value={tagCode}
                    onChange={(e) => setTagCode(e.target.value.toUpperCase())}
                    placeholder="YOT-RUM-1003"
                    required
                  />
                </Field>
                {mode === "intake" ? (
                  <Field label="Link to liquor inventory">
                    <TextSelect
                      value={inventoryId}
                      onChange={(e) => setInventoryId(e.target.value)}
                      required
                    >
                      {liquorItems.length === 0 ? (
                        <option value="">No liquor SKUs — mark one in Inventory</option>
                      ) : (
                        liquorItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))
                      )}
                    </TextSelect>
                  </Field>
                ) : (
                  <p className="rounded-xl border border-main/10 bg-background px-3 py-2 text-sm text-main/55">
                    Tip: try an active tag like{" "}
                    <button
                      type="button"
                      className="cursor-pointer font-semibold text-main underline"
                      onClick={() => setTagCode(active[0]?.tagCode ?? "YOT-RUM-1001")}
                    >
                      {active[0]?.tagCode ?? "YOT-RUM-1001"}
                    </button>
                    .
                  </p>
                )}
              </form>
            </FormPanel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold tracking-tight">Active on floor</h2>
              <p className="mt-1 text-sm text-main/50">
                Sealed/open bottles still in circulation.
              </p>
              {active.length === 0 ? (
                <div className="mt-4">
                  <EmptyState message="No active bottle tags." />
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {active.map((bottle) => (
                    <li
                      key={bottle.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-main/10 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{bottle.tagCode}</p>
                        <p className="truncate text-xs text-main/45">
                          {bottle.productName}
                        </p>
                      </div>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                        Active
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold tracking-tight">Emptied & verified</h2>
              <p className="mt-1 text-sm text-main/50">
                One-for-one empty exchange — originality confirmed.
              </p>
              {destroyed.length === 0 ? (
                <div className="mt-4">
                  <EmptyState message="No emptied bottles yet." />
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {destroyed.map((bottle) => (
                    <li
                      key={bottle.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-main/10 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{bottle.tagCode}</p>
                        <p className="truncate text-xs text-main/45">
                          {bottle.productName}
                          {bottle.destroyedAt
                            ? ` · ${new Date(bottle.destroyedAt).toLocaleString()}`
                            : ""}
                        </p>
                      </div>
                      <span className="rounded-full border border-main/10 bg-background px-2.5 py-1 text-[11px] font-semibold text-main/60">
                        Consumed
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </StaffShell>
  );
}
