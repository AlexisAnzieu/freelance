import { Prisma } from "@prisma/client";
import { CompanyType } from "./constants";

export type CompanyWithTypes = Prisma.CompanyGetPayload<{
  include: { types: true };
}>;

export const filterCompaniesByType = (
  companies: CompanyWithTypes[],
  type: CompanyType
) => {
  return companies.filter((company) =>
    company.types.some((t) => t.name === type)
  );
};
