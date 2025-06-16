// src/components/pdf-styles/PantonePDF.tsx
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export function PantonePDF({ formData }: { formData: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Presupuesto</Text>
          <Text style={styles.clientName}>{formData.nombreCliente}</Text>
        </View>

        {/* Profesional */}
        <View style={styles.profesionalSection}>
          <Text style={styles.sectionTitle}>Profesional</Text>
          <Text>{formData.profesional.nombre}</Text>
          <Text>{formData.profesional.telefono}</Text>
          <Text>{formData.profesional.email}</Text>
        </View>

        {/* Conceptos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conceptos</Text>
          {formData.conceptos.map((concepto: any, index: number) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
            >
              <Text>{concepto.descripcion}</Text>
              <Text>
                {concepto.cantidad} x {concepto.precio.toFixed(2)} €
              </Text>
              <Text>{(concepto.cantidad * concepto.precio).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Total:{" "}
            {formData.conceptos
              .reduce(
                (acc: number, curr: any) => acc + curr.cantidad * curr.precio,
                0
              )
              .toFixed(2)} €
          </Text>
        </View>

        {/* Observaciones */}
        {formData.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text>{formData.observaciones}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#6c4fc4",
    padding: 15,
    borderRadius: 6,
    color: "white",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "white",
  },
  clientName: {
    fontSize: 14,
    marginTop: 4,
    color: "white",
  },
  profesionalSection: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
  },
  rowEven: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 6,
    borderRadius: 4,
  },
  rowOdd: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 6,
    borderRadius: 4,
  },
  totalSection: {
    backgroundColor: "#6c4fc4",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  totalText: {
    textAlign: "right",
    color: "white",
    fontWeight: 700,
  },
});
