"use client";

import { useState } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import type { Invoice } from "@prisma/client";
import { InvoicePDF } from "./invoice-pdf";

interface PDFSectionProps {
  invoice: Invoice & {
    company: {
      companyName: string;
    };
  };
}

export function PDFSection({ invoice }: PDFSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">PDF Preview</h2>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
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
