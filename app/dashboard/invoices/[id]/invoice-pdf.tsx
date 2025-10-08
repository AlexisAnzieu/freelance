import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  bankingInfo: {
    position: "absolute",
    bottom: 30,
    left: 30,
    fontSize: 9,
    color: "#6B7280",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#07b5c8",
  },
  bankingHeader: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bankingTitle: {
    marginBottom: 4,
  },
  bankingDetails: {
    marginTop: 4,
    color: "#4B5563",
  },
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    maxWidth: "60%",
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  invoiceLabel: {
    fontSize: 11,
    color: "#07b5c8",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
    fontWeight: "bold",
  },
  headerRight: {
    textAlign: "right",
  },
  headerDate: {
    marginBottom: 6,
    fontSize: 10,
    color: "#4B5563",
  },
  headerDateLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    marginBottom: 8,
    gap: 16,
  },
  companyBox: {
    width: "48%",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 3,
    borderLeftColor: "#07b5c8",
    borderRadius: 4,
  },
  companyTitle: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  companyName: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  companyDetails: {
    fontSize: 9,
    color: "#4B5563",
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginVertical: 24,
  },
  itemsTable: {
    marginTop: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  description: {
    flex: 3,
  },
  quantity: {
    flex: 1,
    textAlign: "center",
  },
  price: {
    flex: 1,
    textAlign: "right",
  },
  total: {
    flex: 1,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowText: {
    fontSize: 10,
    color: "#1a1a1a",
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: "#E5E7EB",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 10,
    color: "#4B5563",
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 10,
    color: "#1a1a1a",
  },
  grandTotalRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#07b5c8",
    borderRadius: 4,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  grandTotalValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 12,
    objectFit: "contain",
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
  const [primaryContractor] = contractors;
  const [primaryCustomer] = customers;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceTitle}>#{invoice.number}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            {primaryContractor?.logoUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={primaryContractor?.logoUrl} style={styles.logo} />
            )}
          </View>
          <View style={styles.headerRight}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.headerDateLabel}>ISSUE DATE</Text>
              <Text style={styles.headerDate}>
                {new Date(invoice.date).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text style={styles.headerDateLabel}>DUE DATE</Text>
              <Text style={styles.headerDate}>
                {new Date(invoice.dueDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.companiesSection}>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>From</Text>
            <Text style={styles.companyName}>
              {primaryContractor?.companyName || "N/A"}
            </Text>
            {primaryContractor?.contactName && (
              <Text style={styles.companyDetails}>
                {primaryContractor.contactName}
              </Text>
            )}
            {primaryContractor && (
              <Text style={styles.companyDetails}>
                {primaryContractor.email}
              </Text>
            )}
            {primaryContractor && (
              <>
                <Text style={styles.companyDetails}>
                  {primaryContractor.address}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryContractor.city}
                  {primaryContractor.state
                    ? `, ${primaryContractor.state}`
                    : ""}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryContractor.postalCode}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryContractor.country}
                </Text>
              </>
            )}
          </View>
          <View style={styles.companyBox}>
            <Text style={styles.companyTitle}>Bill To</Text>
            <Text style={styles.companyName}>
              {primaryCustomer?.companyName || "N/A"}
            </Text>
            {primaryCustomer?.contactName && (
              <Text style={styles.companyDetails}>
                {primaryCustomer.contactName}
              </Text>
            )}
            {primaryCustomer && (
              <Text style={styles.companyDetails}>{primaryCustomer.email}</Text>
            )}
            {primaryCustomer && (
              <>
                <Text style={styles.companyDetails}>
                  {primaryCustomer.address}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryCustomer.city}
                  {primaryCustomer.state ? `, ${primaryCustomer.state}` : ""}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryCustomer.postalCode}
                </Text>
                <Text style={styles.companyDetails}>
                  {primaryCustomer.country}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {invoice.name && (
          <Text style={styles.projectTitle}>{invoice.name}</Text>
        )}

        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.description, styles.tableHeaderText]}>
              Description
            </Text>
            <Text style={[styles.quantity, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.price, styles.tableHeaderText]}>
              Unit Price
            </Text>
            <Text style={[styles.total, styles.tableHeaderText]}>Amount</Text>
          </View>

          {invoice.items?.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.description, styles.tableRowText]}>
                {item.name}
              </Text>
              <Text style={[styles.quantity, styles.tableRowText]}>
                {item.quantity}
              </Text>
              <Text style={[styles.price, styles.tableRowText]}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                  ?.symbol || "$"}
                {item.unitaryPrice.toFixed(2)}
              </Text>
              <Text style={[styles.total, styles.tableRowText]}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                  ?.symbol || "$"}
                {(item.quantity * item.unitaryPrice).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.description}></Text>
              <Text style={styles.quantity}></Text>
              <Text style={[styles.price, styles.totalLabel]}>Subtotal</Text>
              <Text style={[styles.total, styles.totalValue]}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                  ?.symbol || "$"}
                {invoice.amount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.description}></Text>
              <Text style={styles.quantity}></Text>
              <Text style={[styles.price, styles.totalLabel]}>
                Tax ({invoice.tax}%)
              </Text>
              <Text style={[styles.total, styles.totalValue]}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                  ?.symbol || "$"}
                {(invoice.amount * (invoice.tax / 100)).toFixed(2)}
              </Text>
            </View>

            <View style={styles.grandTotalRow} wrap={false}>
              <Text style={styles.description}></Text>
              <Text style={styles.quantity}></Text>
              <Text style={[styles.price, styles.grandTotalLabel]}>Total</Text>
              <Text style={[styles.total, styles.grandTotalValue]}>
                {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                  ?.symbol || "$"}
                {invoice.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bankingInfo} wrap={false}>
          <Text style={styles.bankingHeader}>Payment information</Text>
          {invoice.selectedPaymentMethod ? (
            <Text style={styles.bankingDetails}>
              {invoice.selectedPaymentMethod}
            </Text>
          ) : (
            <Text style={styles.bankingDetails}>
              No payment method specified
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
