import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff', padding: 40, fontFamily: 'Helvetica' },
  header: { borderBottomWidth: 2, borderBottomColor: '#f97316', paddingBottom: 15, marginBottom: 20 },
  logo: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#f97316', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#888888' },
  section: { marginBottom: 20 },
  title: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: '#f97316', paddingBottom: 4, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 10, color: '#888888' },
  value: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0a0a0a' },
  tokenBox: { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#f97316', borderRadius: 4, padding: 12, marginBottom: 20, alignItems: 'center' },
  tokenLabel: { fontSize: 10, color: '#f97316', fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  tokenValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', letterSpacing: 2 },
  units: { fontSize: 10, color: '#888888', marginTop: 4 },
  footer: { borderTopWidth: 1, borderTopColor: '#eeeeee', paddingTop: 12, alignItems: 'center' },
  footerText: { fontSize: 9, color: '#aaaaaa' },
})

const ElectricityReceipt = ({ data }) => {
  const tx = data?.content?.transactions || {}
  const token = data?.token || tx?.token || ''
  const units = data?.units || ''
  const customerName = data?.customerName || ''
  const customerAddress = data?.customerAddress || ''
  const meterNumber = data?.meterNumber || tx?.unique_element || ''
  const amount = data?.amount || tx?.amount || ''
  const transactionId = tx?.transactionId || ''
  const date = data?.transaction_date
    ? new Date(data.transaction_date).toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })
    : new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>OBISCO STORE</Text>
          <Text style={styles.subtitle}>Electricity Payment Receipt</Text>
        </View>

        {token ? (
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>⚡ RECHARGE TOKEN</Text>
            <Text style={styles.tokenValue}>{token}</Text>
            {units ? <Text style={styles.units}>{units}</Text> : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.title}>Customer Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Meter Number</Text>
            <Text style={styles.value}>{meterNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{customerAddress}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Transaction Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid</Text>
            <Text style={styles.value}>₦{Number(amount).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{transactionId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, { color: '#16a34a' }]}>SUCCESSFUL</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for using Obisco Store</Text>
          <Text style={styles.footerText}>obisco.store • Powered by VTpass</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ElectricityReceipt