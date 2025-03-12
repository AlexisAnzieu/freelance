import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDistanceToNow } from "date-fns";
import type { Invoice } from "@prisma/client";
import { filterCompaniesByType, CompanyWithTypes } from "@/app/lib/db";
import { COMPANY_TYPES } from "@/app/lib/constants";

export interface InvoicePDFProps {
  invoice: Invoice & {
    companies: CompanyWithTypes[];
  };
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    marginVertical: 3,
  },
  label: {
    width: 100,
    color: "#6B7280",
  },
  value: {
    flex: 1,
  },
  amount: {
    marginTop: 20,
  },
  companiesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyBox: {
    width: "45%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
  },
  companyTitle: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 8,
    fontWeight: "bold",
  },
  companyName: {
    fontSize: 14,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginVertical: 20,
  },
});

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const contractors = filterCompaniesByType(
    invoice.companies,
    COMPANY_TYPES.CONTRACTOR
  );
  const customers = filterCompaniesByType(
    invoice.companies,
    COMPANY_TYPES.CUSTOMER
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Invoice #{invoice.number}</Text>
        </View>

        <View style={styles.companiesSection}>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>From:</Text>
            <Text style={styles.companyName}>
              {contractors[0]?.companyName || "N/A"}
            </Text>
          </View>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>To:</Text>
            <Text style={styles.companyName}>
              {customers[0]?.companyName || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Company:</Text>
            <Text style={styles.value}>{customers[0].companyName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Text>
          </View>

          <View style={[styles.row, styles.amount]}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>
              $
              {invoice.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>
              $
              {invoice.tax.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>
              $
              {invoice.totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={[styles.row, styles.amount]}>
            <Text style={styles.label}>Created:</Text>
            <Text style={styles.value}>
              {formatDistanceToNow(invoice.date, { addSuffix: true })}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>
              {formatDistanceToNow(invoice.dueDate, { addSuffix: true })}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Updated:</Text>
            <Text style={styles.value}>
              {formatDistanceToNow(invoice.updatedAt, { addSuffix: true })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
