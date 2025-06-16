// src/components/pdf/minimal-pdf.tsx
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "black",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 4,
  },
  subheader: {
    textAlign: "center",
    fontSize: 10,
    color: "gray",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderTop: "1pt solid #eee",
    borderBottom: "1pt solid #eee",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    paddingVertical: 4,
  },
  tableCell: {
    padding: 2,
  },
  total: {
    textAlign: "right",
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export function MinimalPDF({ formData }: { formData: any }) {
  const { profesional, nombreCliente, conceptos, observaciones } = formData;
  const total = conceptos.reduce(
    (acc: number, item: any) => acc + item.cantidad * item.precio,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Presupuesto</Text>
          <Text style={styles.subheader}>{profesional.nombre}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ marginBottom: 4, color: "gray" }}>Cliente:</Text>
          <Text>{nombreCliente}</Text>
        </View>

        <View style={[styles.section, styles.table]}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Descripción</Text>
            <Text style={styles.tableCol}>Cantidad</Text>
            <Text style={styles.tableCol}>Precio</Text>
            <Text style={styles.tableCol}>Total</Text>
          </View>
          {conceptos.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.descripcion}</Text>
              <Text style={styles.tableCol}>{item.cantidad}</Text>
              <Text style={styles.tableCol}>{item.precio} €</Text>
              <Text style={styles.tableCol}>
                {item.cantidad * item.precio} €
              </Text>
            </View>
          ))}
        </View>

        {observaciones && (
          <View style={styles.section}>
            <Text style={{ marginBottom: 4, color: "gray" }}>Observaciones:</Text>
            <Text>{observaciones}</Text>
          </View>
        )}

        <Text style={styles.total}>Total: {total} €</Text>
      </Page>
    </Document>
  );
}
