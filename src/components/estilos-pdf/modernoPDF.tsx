// src/components/estilos-pdf/ModernoPDF.tsx
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

export function EstiloModernoPDF({ formData }: { formData: any }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.cantidad * c.precio,
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
    },
    headerBar: {
      backgroundColor: "#000000",
      height: 10,
      marginBottom: 20,
    },
    section: {
      marginBottom: 12,
    },
    label: {
      fontWeight: "bold",
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      paddingBottom: 4,
      marginBottom: 4,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: "#ccc",
      paddingVertical: 4,
    },
    cell: {
      width: "20%",
      textAlign: "right",
      paddingRight: 4,
    },
    desc: {
      width: "40%",
      textAlign: "left",
      paddingLeft: 4,
    },
    total: {
      textAlign: "right",
      fontWeight: "bold",
      fontSize: 13,
      marginTop: 12,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar} />
        <View style={styles.section}>
          <Text style={styles.label}>Profesional:</Text>
          <Text>{formData.profesional?.nombre || ""}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Cliente:</Text>
          <Text>{formData.nombreCliente || ""}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Número:</Text>
          <Text>{formData.numeroPresupuesto || ""}</Text>
          <Text style={styles.label}>Fecha:</Text>
          <Text>{formData.fechaEmision || ""}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.desc}>Descripción</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Precio</Text>
          <Text style={styles.cell}>Total</Text>
        </View>

        {formData.conceptos.map((c: any, i: number) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.desc}>{c.descripcion}</Text>
            <Text style={styles.cell}>{c.cantidad}</Text>
            <Text style={styles.cell}>{c.precio.toFixed(2)}€</Text>
            <Text style={styles.cell}>
              {(c.cantidad * c.precio).toFixed(2)}€
            </Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text>Base Imponible: {subtotal.toFixed(2)}€</Text>
          <Text>IVA {formData.iva || 0}%: {iva.toFixed(2)}€</Text>
          <Text>Retención IRPF {formData.irpf || 0}%: -{irpf.toFixed(2)}€</Text>
          <Text style={styles.total}>Total: {total.toFixed(2)}€</Text>
        </View>

        {formData.observaciones && (
          <View style={styles.section}>
            <Text style={styles.label}>Notas:</Text>
            <Text>{formData.observaciones}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
