"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AtSign, ChevronLeft, Eye, EyeOff, KeyRound, Phone } from "lucide-react";
import { YotLogo } from "@/components/branding/YotLogo";
import { Button } from "@/components/ui/Button";
import { DEMO_STOCK_CREDS, authenticateStaff } from "@/lib/staff-auth";

type LoginMethod = "email" | "phone";

export function StaffLoginScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [identifier, setIdentifier] = useState<string>(DEMO_STOCK_CREDS.email);
  const [password, setPassword] = useState<string>(DEMO_STOCK_CREDS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const switchMethod = (next: LoginMethod) => {
    setMethod(next);
    setError("");
    setIdentifier(
      next === "email" ? DEMO_STOCK_CREDS.email : DEMO_STOCK_CREDS.phone,
    );
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const account = authenticateStaff({ method, identifier, password });

    if (!account) {
      setError("Invalid credentials. Use the demo stock manager details.");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "yot-staff",
        JSON.stringify({
          id: account.id,
          name: account.name,
          role: account.role,
          roleLabel: account.roleLabel,
        }),
      );
    }

    router.push(account.portalPath);
  };

  const form = (
    <>
      <div className="mb-8 text-center lg:mb-10 lg:text-left">
        <div className="mb-6 flex justify-center lg:hidden">
          <YotLogo variant="wordmark" className="h-auto w-44 sm:w-52" priority />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-accent lg:text-[2rem]">
          Let&apos;s Sign In
        </h1>
        <p className="mt-2 text-sm text-main/50">
          Welcome back, team. Access your YOT portal.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-full border border-main/10 bg-background p-1">
          <button
            type="button"
            onClick={() => switchMethod("email")}
            className={[
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
              method === "email"
                ? "bg-accent text-white"
                : "text-main/50 hover:text-main",
            ].join(" ")}
          >
            <AtSign className="h-4 w-4" strokeWidth={2.1} />
            Email
          </button>
          <button
            type="button"
            onClick={() => switchMethod("phone")}
            className={[
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
              method === "phone"
                ? "bg-accent text-white"
                : "text-main/50 hover:text-main",
            ].join(" ")}
          >
            <Phone className="h-4 w-4" strokeWidth={2.1} />
            Phone
          </button>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-main/70">
            {method === "email" ? "Email Address" : "Phone Number"}
          </span>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-main/15 bg-white px-3 lg:rounded-2xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
              {method === "email" ? (
                <AtSign className="h-4 w-4" strokeWidth={2.1} />
              ) : (
                <Phone className="h-4 w-4" strokeWidth={2.1} />
              )}
            </span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              type={method === "email" ? "email" : "tel"}
              inputMode={method === "email" ? "email" : "tel"}
              placeholder={
                method === "email" ? "insert your email" : "insert your phone"
              }
              className="h-full w-full bg-transparent text-sm text-main outline-none placeholder:text-main/35"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-main/70">
            Password
          </span>
          <div className="flex h-12 items-center gap-3 rounded-xl border border-main/15 bg-white px-3 lg:rounded-2xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-main/10 text-main">
              <KeyRound className="h-4 w-4" strokeWidth={2.1} />
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="insert your password"
              className="h-full w-full bg-transparent text-sm text-main outline-none placeholder:text-main/35"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-main/45 hover:text-main"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={2.1} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2.1} />
              )}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-main/60">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-main/30 accent-accent"
            />
            Remember me
          </label>
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="accent" className="max-w-none mt-2 h-12 w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-main/10 bg-background px-4 py-3 text-left text-xs text-main/55">
        <p className="font-semibold text-main">Demo Stock Manager</p>
        <p className="mt-1">Email: {DEMO_STOCK_CREDS.email}</p>
        <p>Phone: {DEMO_STOCK_CREDS.phone}</p>
        <p>Password: {DEMO_STOCK_CREDS.password}</p>
      </div>

      <p className="mt-8 text-center text-sm text-main/45 lg:text-left">
        Guest instead?{" "}
        <Link
          href="/scan"
          className="cursor-pointer font-semibold text-accent underline-offset-2 hover:underline"
        >
          Continue as Guest
        </Link>
      </p>
    </>
  );

  return (
    <main className="min-h-dvh bg-white lg:grid lg:grid-cols-2">
      {/* Left brand panel — desktop */}
      <section className="relative hidden items-center justify-center bg-main px-12 xl:px-16 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,166,117,0.14)_0%,transparent_62%)]"
        />
        <div className="relative z-10 w-full max-w-md xl:max-w-lg">
          <YotLogo variant="wordmark" className="h-auto w-full" priority />
          <p className="mt-8 text-center text-sm text-white/55 xl:text-base">
            Staff access for stock, kitchen, and floor operations.
          </p>
        </div>
      </section>

      {/* Right form panel */}
      <section className="relative flex min-h-dvh flex-col px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
        <Link
          href="/"
          aria-label="Back to welcome"
          className="mb-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-main/10 bg-accent text-white lg:absolute lg:top-8 lg:left-8 xl:left-12"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center lg:mx-0 lg:max-w-lg">
          {form}
        </div>
      </section>
    </main>
  );
}
