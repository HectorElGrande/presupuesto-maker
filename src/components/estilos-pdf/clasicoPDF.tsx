import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

export function ClasicoPDF({ formData }: { formData: any }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, item: any) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Presupuesto</Text>

        <View style={styles.section}>
          <View>
            <Text style={styles.professionalName}>{formData.profesional.nombre}</Text>
            {formData.profesional.email && (
              <Text>{formData.profesional.email}</Text>
            )}
            {formData.profesional.telefono && (
              <Text>{formData.profesional.telefono}</Text>
            )}
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.clientLabel}>Cliente: <Text style={styles.clientText}>{formData.nombreCliente || "Nombre del cliente"}</Text></Text>
            <Text style={styles.clientLabel}>Fecha: <Text style={styles.clientText}>{formData.fecha || new Date().toLocaleDateString()}</Text></Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Descripción</Text>
            <Text style={styles.tableHeaderCell}>Cantidad</Text>
            <Text style={styles.tableHeaderCell}>Precio</Text>
            <Text style={styles.tableHeaderCell}>Total</Text>
          </View>

          {formData.conceptos.map((item: any, index: number) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
              ]}
            >
              <Text style={styles.tableCell}>{item.descripcion}</Text>
              <Text style={styles.tableCell}>{item.cantidad}</Text>
              <Text style={styles.tableCell}>{item.precio.toFixed(2)} €</Text>
              <Text style={styles.tableCell}>
                {(item.precio * item.cantidad).toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        {formData.observaciones && (
          <Text style={styles.notes}>
            <Text style={styles.notesLabel}>Notas:</Text> {formData.observaciones}
          </Text>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{subtotal.toFixed(2)} €</Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  professionalName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  clientLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  clientText: {
    fontWeight: "normal",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    flex: 1,
    padding: 6,
  },
  notes: {
    marginTop: 20,
  },
  notesLabel: {
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
