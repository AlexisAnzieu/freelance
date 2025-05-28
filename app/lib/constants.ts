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
