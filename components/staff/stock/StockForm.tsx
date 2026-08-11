"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const FIELD =
  "h-11 w-full rounded-xl border border-main/15 bg-white px-3.5 text-sm text-main outline-none transition focus:border-accent";
const LABEL = "mb-1.5 block text-sm font-semibold text-main";
const HINT = "mt-1.5 text-xs text-main/45";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      {children}
      {hint ? <span className={HINT}>{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[FIELD, props.className ?? ""].join(" ")} />;
}

export function TextSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[FIELD, "cursor-pointer", props.className ?? ""].join(" ")}
    />
  );
}

export function TextTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-24 w-full rounded-xl border border-main/15 bg-white px-3.5 py-3 text-sm text-main outline-none transition focus:border-accent",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function FormPanel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-main/10 bg-white p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-main">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-main/50">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
      {footer ? <div className="mt-5 flex flex-wrap gap-2">{footer}</div> : null}
    </section>
  );
}

export function StatCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: string | number;
  note?: string;
  tone?: "default" | "warn" | "good" | "danger";
}) {
  const valueClass =
    tone === "warn"
      ? "text-amber-700"
      : tone === "good"
        ? "text-emerald-700"
        : tone === "danger"
          ? "text-red-600"
          : "text-main";

  return (
    <div className="rounded-2xl border border-main/10 bg-white p-4">
      <p className="text-xs font-medium text-main/45">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
      {note ? <p className="mt-1 text-xs text-main/40">{note}</p> : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-main/15 bg-white px-4 py-10 text-center text-sm text-main/45">
      {message}
    </div>
  );
}

export function Feedback({
  tone,
  message,
}: {
  tone: "ok" | "error";
  message: string;
}) {
  return (
    <p
      className={[
        "rounded-xl border px-3 py-2 text-sm",
        tone === "ok"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700",
      ].join(" ")}
    >
      {message}
    </p>
  );
}
