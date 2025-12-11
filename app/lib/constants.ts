export const COMPANY_TYPES = {
  CUSTOMER: "customer",
  CONTRACTOR: "contractor",
} as const;

export type CompanyType = (typeof COMPANY_TYPES)[keyof typeof COMPANY_TYPES];

export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "$", name: "Australian Dollar" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
} as const;

export type Currency = keyof typeof CURRENCIES;

export const PROJECT_COLORS = [
  {
    name: "Blue",
    hex: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.8)",
    border: "rgba(59, 130, 246, 1)",
  },
  {
    name: "Red",
    hex: "#EF4444",
    bg: "rgba(239, 68, 68, 0.8)",
    border: "rgba(239, 68, 68, 1)",
  },
  {
    name: "Orange",
    hex: "#F97316",
    bg: "rgba(249, 115, 22, 0.8)",
    border: "rgba(249, 115, 22, 1)",
  },
  {
    name: "Yellow",
    hex: "#EAB308",
    bg: "rgba(234, 179, 8, 0.8)",
    border: "rgba(234, 179, 8, 1)",
  },
  {
    name: "Green",
    hex: "#22C55E",
    bg: "rgba(34, 197, 94, 0.8)",
    border: "rgba(34, 197, 94, 1)",
  },
  {
    name: "Teal",
    hex: "#14B8A6",
    bg: "rgba(20, 184, 166, 0.8)",
    border: "rgba(20, 184, 166, 1)",
  },
  {
    name: "Cyan",
    hex: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.8)",
    border: "rgba(6, 182, 212, 1)",
  },
  {
    name: "Purple",
    hex: "#9333EA",
    bg: "rgba(147, 51, 234, 0.8)",
    border: "rgba(147, 51, 234, 1)",
  },
  {
    name: "Pink",
    hex: "#EC4899",
    bg: "rgba(236, 72, 153, 0.8)",
    border: "rgba(236, 72, 153, 1)",
  },
  {
    name: "Gray",
    hex: "#6B7280",
    bg: "rgba(107, 114, 128, 0.8)",
    border: "rgba(107, 114, 128, 1)",
  },
] as const;

export function getProjectColorByHex(hex: string) {
  const predefined = PROJECT_COLORS.find((c) => c.hex === hex);
  if (predefined) return predefined;

  // For custom colors, generate bg and border from the hex
  return {
    name: "Custom",
    hex,
    bg: `${hex}cc`, // hex with 80% opacity
    border: hex,
  };
}
