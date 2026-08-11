"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanStatus } from "@/components/scan/ScanStatus";
import { ScanViewfinder } from "@/components/scan/ScanViewfinder";
import { Button } from "@/components/ui/Button";

type ScanTone = "scanning" | "ready" | "error";

type ScanUiState = {
  tone: ScanTone;
  label: string;
  showGlyph: boolean;
  canRetry: boolean;
};

/** Temporary demo table until real QR mapping is wired. */
const DEMO_TABLE_ID = "12";
const CAPTURE_DELAY_MS = 1400;

export function ScanScreen() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handledRef = useRef(false);
  const captureTimerRef = useRef<number | null>(null);
  const [ui, setUi] = useState<ScanUiState>({
    tone: "scanning",
    label: "Scanning...",
    showGlyph: true,
    canRetry: false,
  });

  const clearCaptureTimer = useCallback(() => {
    if (captureTimerRef.current !== null) {
      window.clearTimeout(captureTimerRef.current);
      captureTimerRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    streamRef.current = null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const goToMenu = useCallback(() => {
    if (handledRef.current) return;
    handledRef.current = true;
    clearCaptureTimer();

    setUi({
      tone: "ready",
      label: "Captured",
      showGlyph: false,
      canRetry: false,
    });

    stopCamera();
    router.push(`/menu?table=${DEMO_TABLE_ID}`);
  }, [clearCaptureTimer, router, stopCamera]);

  const startCamera = useCallback(async () => {
    handledRef.current = false;
    clearCaptureTimer();
    setUi({
      tone: "scanning",
      label: "Scanning...",
      showGlyph: true,
      canRetry: false,
    });

    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element missing");
      }

      video.srcObject = stream;
      await video.play();

      setUi((prev) => ({ ...prev, showGlyph: false, label: "Scanning..." }));

      // Hardcoded MVP: any live camera frame counts as a successful capture.
      captureTimerRef.current = window.setTimeout(() => {
        goToMenu();
      }, CAPTURE_DELAY_MS);
    } catch {
      setUi({
        tone: "error",
        label: "Camera access needed",
        showGlyph: true,
        canRetry: true,
      });
      stopCamera();
    }
  }, [clearCaptureTimer, goToMenu, stopCamera]);

  useEffect(() => {
    void startCamera();
    return () => {
      clearCaptureTimer();
      stopCamera();
    };
    // Run once on mount for the MVP capture flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative flex min-h-dvh flex-col bg-main px-6 py-10 sm:px-8 md:px-12">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center sm:max-w-xl md:max-w-2xl">
        <header className="scan-enter w-full pt-4 text-center sm:pt-8">
          <h1 className="text-[1.65rem] leading-tight font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Scan Table QR Code
          </h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-white/55 sm:mt-4 sm:max-w-sm sm:text-base">
            Point your camera at the QR code on your table to view the menu
          </p>
        </header>

        <div className="scan-enter-delay flex flex-1 flex-col items-center justify-center py-10 sm:py-12">
          <ScanViewfinder showGlyph={ui.showGlyph}>
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
          </ScanViewfinder>

          {ui.canRetry ? (
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <Button type="button" onClick={() => void startCamera()}>
                Enable Camera
              </Button>
              <button
                type="button"
                onClick={goToMenu}
                className="text-sm font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
              >
                Continue to menu
              </button>
            </div>
          ) : null}
        </div>

        <div className="scan-enter-delay-2 flex w-full justify-center pb-6 sm:pb-10">
          <ScanStatus label={ui.label} tone={ui.tone} />
        </div>
      </div>
    </main>
  );
}
