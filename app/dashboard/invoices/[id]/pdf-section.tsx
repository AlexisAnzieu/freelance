"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF, InvoicePDFProps } from "./invoice-pdf";

export function PDFSection({ invoice }: InvoicePDFProps) {
  return (
    <div className="mt-8">
      <div
        className="border rounded-lg overflow-hidden"
        style={{ height: "800px" }}
      >
        <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      </div>
    </div>
  );
}
