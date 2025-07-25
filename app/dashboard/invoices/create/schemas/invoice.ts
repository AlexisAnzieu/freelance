import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Activity description is required"),
  quantity: z.number().min(0, "Quantity must be at least 0"),
  unitaryPrice: z.number().min(0, "Price must be positive"),
  timeEntryId: z.string().optional(),
});

export const invoiceSchema = z.object({
  name: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  contractorId: z.string().min(1, "Contractor is required"),
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  currency: z.string().default("CAD"),
  tax: z.number().min(0, "Tax rate must be positive"),
  status: z.enum(["DRAFT", "SENT", "PAID"]),
  selectedPaymentMethod: z.string(),
  items: z.array(invoiceItemSchema).min(1, "At least one activity is required"),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;
export type InvoiceItemSchema = z.infer<typeof invoiceItemSchema>;
