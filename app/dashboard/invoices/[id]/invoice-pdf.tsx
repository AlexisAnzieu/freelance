import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDistanceToNow } from "date-fns";
import type { Invoice } from "@prisma/client";

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
});

interface InvoicePDFProps {
  invoice: Invoice & {
    customer: {
      companyName: string;
    };
  };
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Invoice #{invoice.number}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.value}>{invoice.customer.companyName}</Text>
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
