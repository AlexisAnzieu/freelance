export const COMPANY_TYPES = {
  CUSTOMER: "customer",
  CONTRACTOR: "contractor",
} as const;

export type CompanyType = (typeof COMPANY_TYPES)[keyof typeof COMPANY_TYPES];
