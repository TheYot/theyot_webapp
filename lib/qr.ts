/** Pull a usable table id from raw QR payload (URL or plain text). */
export function extractTableId(raw: string): string {
  const value = raw.trim();
  if (!value) return "unknown";

  try {
    const url = new URL(value);
    const fromQuery =
      url.searchParams.get("table") ??
      url.searchParams.get("tableId") ??
      url.searchParams.get("t");
    if (fromQuery) return fromQuery;

    const parts = url.pathname.split("/").filter(Boolean);
    const tableIndex = parts.findIndex(
      (part) => part === "table" || part === "t",
    );
    if (tableIndex >= 0 && parts[tableIndex + 1]) {
      return parts[tableIndex + 1];
    }

    if (parts.length > 0) return parts[parts.length - 1];
  } catch {
    // Not a URL — treat as plain table code.
  }

  return value.replace(/^table[-_:\s]*/i, "") || value;
}
