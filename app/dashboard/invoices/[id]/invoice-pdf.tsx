import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Invoice, InvoiceItem } from "@prisma/client";
import { filterCompaniesByType, CompanyWithTypes } from "@/app/lib/db";
import { COMPANY_TYPES, CURRENCIES } from "@/app/lib/constants";

export interface InvoicePDFProps {
  invoice: Invoice & {
    companies: CompanyWithTypes[];
    items: Pick<InvoiceItem, "unitaryPrice" | "quantity" | "name" | "id">[];
    name?: string | null;
    currency: string;
    selectedPaymentMethod?: string | null;
  };
}

const styles = StyleSheet.create({
  projectTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  bankingInfo: {
    position: "absolute",
    bottom: 30,
    left: 30,
    fontSize: 10,
  },
  bankingHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bankingTitle: {
    marginBottom: 4,
  },
  bankingDetails: {
    marginTop: 4,
  },
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    fontSize: 24,
  },
  headerRight: {
    textAlign: "right",
  },
  headerDate: {
    marginBottom: 4,
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
  itemsTable: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
    marginBottom: 8,
  },
  description: {
    flex: 3,
    fontWeight: "bold",
  },
  quantity: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  price: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  total: {
    flex: 1,
    textAlign: "right",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
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
          <View>
            <Text style={styles.headerLeft}>Invoice #{invoice.number}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>
              Date: {new Date(invoice.date).toLocaleDateString()}
            </Text>
            <Text style={styles.headerDate}>
              Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.companiesSection}>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>From:</Text>
            <Text style={styles.companyName}>
              {contractors[0]?.companyName || "N/A"}
            </Text>
            {contractors[0]?.contactName && (
              <Text>{contractors[0].contactName}</Text>
            )}
            {contractors[0] && <Text>{contractors[0].email}</Text>}
            {contractors[0] && (
              <>
                <Text>{contractors[0].address}</Text>
                <Text>
                  {contractors[0].city}
                  {contractors[0].state ? `, ${contractors[0].state}` : ""}
                </Text>
                <Text>{contractors[0].postalCode}</Text>
                <Text>{contractors[0].country}</Text>
              </>
            )}
          </View>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>To:</Text>
            <Text style={styles.companyName}>
              {customers[0]?.companyName || "N/A"}
            </Text>
            {customers[0]?.contactName && (
              <Text>{customers[0].contactName}</Text>
            )}
            {customers[0] && <Text>{customers[0].email}</Text>}
            {customers[0] && (
              <>
                <Text>{customers[0].address}</Text>
                <Text>
                  {customers[0].city}
                  {customers[0].state ? `, ${customers[0].state}` : ""}
                </Text>
                <Text>{customers[0].postalCode}</Text>
                <Text>{customers[0].country}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.projectTitle}>{invoice.name || "\u00A0"}</Text>

        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {invoice.items?.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.description}>{item.name}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.price}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]?.symbol || "$"}
                {item.unitaryPrice.toFixed(2)}
              </Text>
              <Text style={styles.total}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]?.symbol || "$"}
                {(item.quantity * item.unitaryPrice).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.description}></Text>
            <Text style={styles.quantity}></Text>
            <Text style={[styles.price, { fontWeight: "bold" }]}>
              Subtotal:
            </Text>
            <Text style={styles.total}>
              {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]?.symbol || "$"}
              {invoice.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.description}></Text>
            <Text style={styles.quantity}></Text>
            <Text style={[styles.price, { fontWeight: "bold" }]}>
              Tax ({invoice.tax}%):
            </Text>
            <Text style={styles.total}>
              {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]?.symbol || "$"}
              {(invoice.amount * (invoice.tax / 100)).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.tableRow, { marginTop: 8 }]}>
            <Text style={styles.description}></Text>
            <Text style={styles.quantity}></Text>
            <Text style={[styles.price, { fontWeight: "bold" }]}>Total:</Text>
            <Text style={[styles.total, { fontWeight: "bold" }]}>
              {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]?.symbol || "$"}
              {invoice.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.bankingInfo}>
          <Text style={styles.bankingHeader}>Payment information</Text>
          {invoice.selectedPaymentMethod ? (
            <Text style={styles.bankingDetails}>{invoice.selectedPaymentMethod}</Text>
          ) : (
            <Text style={styles.bankingDetails}>No payment method specified</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
