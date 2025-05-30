import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "../../[id]/invoice-pdf";
import { CompanyWithTypes } from "@/app/lib/db";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitaryPrice: number;
  timeEntryId?: string;
}

interface InvoiceFormData {
  name: string;
  customerId: string;
  contractorId: string;
  number: string;
  date: string;
  dueDate: string;
  tax: number;
  status: string;
  companies: CompanyWithTypes[];
  teamId: string;
  items: InvoiceItem[];
  currency: string;
}

interface InvoicePreviewProps {
  formData: InvoiceFormData;
}

export function InvoicePreview({ formData }: InvoicePreviewProps) {
  const subtotal = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.unitaryPrice,
    0
  );

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm sticky top-6"
      style={{ height: "800px" }}
    >
      <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
        <InvoicePDF
          invoice={{
            ...formData,
            id: "preview",
            date: new Date(formData.date),
            dueDate: new Date(formData.dueDate),
            createdAt: new Date(),
            updatedAt: new Date(),
            amount: subtotal,
            totalAmount: subtotal * (1 + Number(formData.tax) / 100),
            selectedPaymentMethod: null,
          }}
        />
      </PDFViewer>
    </div>
  );
}
