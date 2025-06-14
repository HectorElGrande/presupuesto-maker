"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

export function PresupuestoPDF({ formData, estilo }: { formData: any, estilo: string }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.cantidad * c.precio,
    0
  );

  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const styles = getStyles(estilo || "moderno");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Presupuesto</Text>
        {formData.logo && (
          <Image src={formData.logo} style={{ height: 60, width: 60, marginBottom: 12 }} />
        )}
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
          <Text style={[styles.cell, styles.desc]}>Descripción</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Precio</Text>
          <Text style={styles.cell}>Total</Text>
        </View>

        {formData.conceptos.map((c: any, i: number) => (
          <View style={styles.tableRow} key={i}>
            <Text style={[styles.cell, styles.desc]}>{c.descripcion}</Text>
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

        <View style={styles.section}>
          <Text style={styles.label}>Notas:</Text>
          <Text>{formData.observaciones || ""}</Text>
        </View>
      </Page>
    </Document>
  );
}

function getStyles(estilo: string) {
  switch (estilo) {
    case "pantone":
      return StyleSheet.create({
        page: {
          padding: 50,
          fontSize: 11,
          fontFamily: "Helvetica",
          backgroundColor: "#f5f5f5",
        },
        title: {
          fontSize: 22,
          marginBottom: 24,
          textAlign: "center",
          color: "#1e40af",
        },
        section: {
          marginBottom: 12,
        },
        label: {
          fontWeight: "bold",
          color: "#0f172a",
          marginBottom: 2,
        },
        tableHeader: {
          flexDirection: "row",
          backgroundColor: "#e2e8f0",
          borderBottomWidth: 1,
          borderBottomColor: "#94a3b8",
          borderBottomStyle: "solid",
          paddingVertical: 6,
          marginBottom: 4,
        },
        tableRow: {
          flexDirection: "row",
          paddingVertical: 4,
          borderBottomWidth: 0.5,
          borderBottomColor: "#cbd5e1",
          borderBottomStyle: "solid",
        },
        cell: {
          width: "20%",
          textAlign: "right",
          paddingRight: 6,
        },
        desc: {
          width: "40%",
          textAlign: "left",
          paddingLeft: 6,
        },
        total: {
          textAlign: "right",
          fontWeight: "bold",
          fontSize: 13,
          marginTop: 16,
          color: "#1e293b",
        },
      });
    case "clasico":
      return StyleSheet.create({ /* estilos para clásico */ });
    case "minimal":
      return StyleSheet.create({ /* estilos para minimal */ });
    default: // moderno
      return StyleSheet.create({
        page: {
          padding: 40,
          fontSize: 12,
          fontFamily: "Helvetica",
        },
        title: {
          fontSize: 18,
          marginBottom: 20,
          textAlign: "center",
          fontWeight: "bold",
        },
        section: {
          marginBottom: 16,
        },
        label: {
          fontWeight: "bold",
          marginBottom: 4,
        },
        tableHeader: {
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#000",
          borderBottomStyle: "solid",
          paddingBottom: 4,
          marginBottom: 4,
        },
        tableRow: {
          flexDirection: "row",
          paddingVertical: 2,
          borderBottomWidth: 0.5,
          borderBottomColor: "#ccc",
          borderBottomStyle: "solid",
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
  }
}
