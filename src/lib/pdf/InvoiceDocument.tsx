import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#10b981', // Emerald 500
    fontWeight: 'bold',
  },
  invoiceDetails: {
    textAlign: 'right',
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginTop: 5,
  },
  value: {
    fontSize: 12,
    color: '#000000',
  },
  billTo: {
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: 10,
    marginBottom: 10,
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'right' },
  col3: { flex: 1, textAlign: 'right' },
  colHeader: {
    fontSize: 10,
    color: '#666666',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 12,
    color: '#000000',
  },
  totalSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666666',
    width: 100,
  },
  totalValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    width: 100,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  }
});

interface InvoiceProps {
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  description: string;
  amount: number;
}

export const InvoiceDocument = ({ invoiceNo, issueDate, dueDate, clientName, description, amount }: InvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 10 }}>Southern Africa Development Institute</Text>
          <Text style={{ fontSize: 10, color: '#666' }}>123 Corporate Ave, Sandton</Text>
          <Text style={{ fontSize: 10, color: '#666' }}>South Africa</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.label}>Invoice Number</Text>
          <Text style={styles.value}>{invoiceNo}</Text>
          <Text style={styles.label}>Date of Issue</Text>
          <Text style={styles.value}>{issueDate}</Text>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>{dueDate}</Text>
        </View>
      </View>

      <View style={styles.billTo}>
        <Text style={styles.label}>Billed To:</Text>
        <Text style={[styles.value, { fontWeight: 'bold', marginTop: 5 }]}>{clientName}</Text>
      </View>

      <View style={styles.tableHeader}>
        <View style={styles.col1}><Text style={styles.colHeader}>Description</Text></View>
        <View style={styles.col2}><Text style={styles.colHeader}>Qty</Text></View>
        <View style={styles.col3}><Text style={styles.colHeader}>Amount</Text></View>
      </View>

      <View style={styles.tableRow}>
        <View style={styles.col1}><Text style={styles.itemText}>{description}</Text></View>
        <View style={styles.col2}><Text style={styles.itemText}>1</Text></View>
        <View style={styles.col3}><Text style={styles.itemText}>ZAR {amount.toFixed(2)}</Text></View>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={[styles.value, { width: 100, textAlign: 'right' }]}>ZAR {amount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax (0%)</Text>
          <Text style={[styles.value, { width: 100, textAlign: 'right' }]}>ZAR 0.00</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 10, borderTop: '1px solid #000', paddingTop: 10 }]}>
          <Text style={[styles.totalLabel, { color: '#000', fontWeight: 'bold' }]}>Total Due</Text>
          <Text style={styles.totalValue}>ZAR {amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for choosing SADI. Payment is due within 30 days.</Text>
        <Text style={styles.footerText}>Bank Details: Standard Bank, Acc: 123456789, Branch: 000000</Text>
      </View>
    </Page>
  </Document>
);
