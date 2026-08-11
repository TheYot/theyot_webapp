export type StaffRole = "stock_manager";

export type StaffAccount = {
  id: string;
  name: string;
  role: StaffRole;
  roleLabel: string;
  email: string;
  phone: string;
  password: string;
  portalPath: string;
};

/** Demo-only staff accounts — no backend auth. */
export const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: "stock-1",
    name: "Diana Nkusi",
    role: "stock_manager",
    roleLabel: "Stock Manager",
    email: "stock@theyot.com",
    phone: "0780000001",
    password: "stock123",
    portalPath: "/staff/stock",
  },
];

export function authenticateStaff(input: {
  method: "email" | "phone";
  identifier: string;
  password: string;
}): StaffAccount | null {
  const identifier = input.identifier.trim().toLowerCase();
  const password = input.password.trim();

  return (
    STAFF_ACCOUNTS.find((account) => {
      if (account.password !== password) return false;
      if (input.method === "email") {
        return account.email.toLowerCase() === identifier;
      }
      const phone = identifier.replace(/\s+/g, "");
      return account.phone === phone;
    }) ?? null
  );
}

export const DEMO_STOCK_CREDS = {
  email: "stock@theyot.com",
  phone: "0780000001",
  password: "stock123",
} as const;
