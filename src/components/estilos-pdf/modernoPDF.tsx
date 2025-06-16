"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
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
      padding: 30,
      fontSize: 10,
      fontFamily: "Helvetica",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    header: {
      backgroundColor: "#4b4b4b",
      color: "white",
      textAlign: "center",
      padding: 8,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    column: {
      flexDirection: "column",
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
      marginTop: 8,
      fontWeight: "bold",
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
    },
    desc: {
      width: "40%",
      textAlign: "left",
    },
    total: {
      textAlign: "right",
      fontWeight: "bold",
      fontSize: 12,
      marginTop: 10,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: "#333",
      paddingTop: 6,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 9,
      marginTop: 16,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View>
          <Text style={styles.header}>Factura</Text>

          <View style={[styles.row, { marginBottom: 12 }]}>
            <View style={styles.column}>
              <Text style={styles.label}>Datos del Emisor</Text>
              <Text><Text style={styles.label}>Nombre: </Text>{formData.emisor?.nombre}</Text>
              <Text><Text style={styles.label}>NIF: </Text>{formData.emisor?.nif}</Text>
              <Text><Text style={styles.label}>Domicilio Fiscal: </Text>{formData.emisor?.direccion}</Text>
              <Text><Text style={styles.label}>Código Postal: </Text>{formData.emisor?.codigoPostal}</Text>
              <Text><Text style={styles.label}>Ciudad: </Text>{formData.emisor?.ciudad}</Text>
              <Text><Text style={styles.label}>Provincia: </Text>{formData.emisor?.provincia}</Text>
              <Text><Text style={styles.label}>País: </Text>{formData.emisor?.pais}</Text>
              <Text><Text style={styles.label}>Teléfono: </Text>{formData.emisor?.telefono}</Text>
              <Text><Text style={styles.label}>Email: </Text>{formData.emisor?.email}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Datos del Cliente</Text>
              <Text><Text style={styles.label}>Nombre: </Text>{formData.cliente?.nombre}</Text>
              <Text><Text style={styles.label}>NIF: </Text>{formData.cliente?.nif}</Text>
              <Text><Text style={styles.label}>Domicilio Fiscal: </Text>{formData.cliente?.direccion}</Text>
              <Text><Text style={styles.label}>Código Postal: </Text>{formData.cliente?.codigoPostal}</Text>
              <Text><Text style={styles.label}>Ciudad: </Text>{formData.cliente?.ciudad}</Text>
              <Text><Text style={styles.label}>Provincia: </Text>{formData.cliente?.provincia}</Text>
              <Text><Text style={styles.label}>País: </Text>{formData.cliente?.pais}</Text>
              <Text><Text style={styles.label}>Teléfono: </Text>{formData.cliente?.telefono}</Text>
              <Text><Text style={styles.label}>Email: </Text>{formData.cliente?.email}</Text>
            </View>
          </View>

          <View style={[styles.row, { marginBottom: 10 }]}>
            <Text><Text style={styles.label}>Número: </Text>{formData.numeroPresupuesto}</Text>
            <Text><Text style={styles.label}>Fecha de emisión: </Text>{formData.fechaEmision}</Text>
            <Text><Text style={styles.label}>Fecha de vencimiento: </Text>{formData.fechaVencimiento}</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.desc}>Descripción</Text>
            <Text style={styles.cell}>Cantidad</Text>
            <Text style={styles.cell}>Precio</Text>
            <Text style={styles.cell}>Total</Text>
          </View>

          {formData.conceptos.map((c: any, i: number) => (
            <View style={styles.tableRow} key={i} wrap={false}>
              <Text style={styles.desc}>{c.descripcion}</Text>
              <Text style={styles.cell}>{c.cantidad}</Text>
              <Text style={styles.cell}>{c.precio.toFixed(2)}€</Text>
              <Text style={styles.cell}>{(c.cantidad * c.precio).toFixed(2)}€</Text>
            </View>
          ))}

          <View style={[styles.column, { alignItems: 'flex-end', marginTop: 12 }]}>
            <Text>Base imponible: {subtotal.toFixed(2)}€</Text>
            <Text>IVA ({formData.iva || 0}%): {iva.toFixed(2)}€</Text>
            <Text>Retención IRPF ({formData.irpf || 0}%): -{irpf.toFixed(2)}€</Text>
            <Text style={styles.total}>Total: {total.toFixed(2)}€</Text>
          </View>

          {formData.observaciones && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Notas:</Text>
              <Text>{formData.observaciones}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {formData.numeroPresupuesto} - {total.toFixed(2)}€ Vencimiento {formData.fechaVencimiento}
          </Text>
          <Text>
            Pág. 1/1
          </Text>
        </View>
      </Page>
    </Document>
  );
}
