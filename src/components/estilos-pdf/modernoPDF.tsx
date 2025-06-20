"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { FooterPDF } from "@/components/pdf-footer"; // Asumo que tienes este componente

// Definición de tipos para asegurar la consistencia de los datos
interface Concepto {
  cantidad: number;
  descripcion: string;
  precio: number;
  descuento?: number;
  importe?: number;
}

interface DatosFiscales {
  nombre: string;
  nif: string;
  direccion: string;
  cp: string;
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
}

interface FormData {
  conceptos: Concepto[];
  emisor: DatosFiscales;
  cliente: DatosFiscales;
  fechaEmision: string;
  fechaVencimiento: string;
  numeroPresupuesto: string;
  iva: number;
  irpf: number;
  observaciones: string;
}

// Opcional: Registrar fuentes si quieres usar una fuente personalizada como Inter
// Asegúrate de que los archivos .ttf estén accesibles en tu ruta pública (ej: /public/fonts/)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });
// Font.register({ family: 'Inter Bold', src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' });
// Font.register({ family: 'Inter Extrabold', src: '/fonts/Inter-ExtraBold.ttf', fontWeight: 'extrabold' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica", // Cambia a 'Inter' si registraste la fuente
    color: "#333",
  },
  // Encabezado
  headerContainer: {
    backgroundColor: "#1F2937", // bg-gray-900
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    borderRadius: 8, // Simula rounded-lg
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 28, // text-3xl
    fontWeight: "extrabold", // font-extrabold
    letterSpacing: 2, // tracking-widest
    textTransform: "uppercase", // uppercase
    // fontFamily: 'Inter Extrabold', // Si registraste la fuente
  },
  headerNumber: {
    color: "white",
    fontSize: 16, // text-lg
    fontWeight: "bold", // font-semibold
    opacity: 0.8, // opacity-80
  },

  // Contenido principal de la página (dentro del padding de la página)
  contentWrapper: {
    paddingHorizontal: 0, // No añadir padding extra si la página ya tiene
    paddingVertical: 0,
    backgroundColor: "white",
    // boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Sombras complejas son difíciles en PDF
    borderRadius: 8, // simula rounded-lg
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },

  // Sección de Fechas y Número de Presupuesto
  docDetailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // border-gray-200
    gap: 20,
    paddingHorizontal: 30,
  },
  docDetailColumn: {
    flexDirection: "column",
    flexGrow: 1, // Permite que cada columna crezca
    flexBasis: "30%", // Aproximadamente 1/3
    // width: '30%', // Alternativa a flexBasis si los elementos no se distribuyen bien
  },
  docDetailLabel: {
    fontWeight: "bold",
    color: "#1F2937", // text-gray-900
    marginBottom: 4,
  },
  docDetailText: {
    color: "#4B5563", // text-gray-700
  },

  // Datos de Emisor y Cliente
  dataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 30, // gap-8
    paddingHorizontal: 30,
  },
  dataCard: {
    flexGrow: 1,
    flexBasis: "48%", // Aproximadamente la mitad para 2 columnas
    padding: 15, // p-5
    borderRadius: 8, // rounded-md
    backgroundColor: "#F9FAFB", // bg-gray-50
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    lineHeight: 1.5,
  },
  dataCardTitle: {
    fontWeight: "bold", // font-bold
    fontSize: 14, // text-lg
    marginBottom: 8,
    color: "#1F2937", // text-gray-900
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB", // border-gray-300
    paddingBottom: 5, // pb-2
  },
  dataText: {
    fontSize: 9, // Ajustado para que quepa bien
    color: "#4B5563", // text-gray-700
  },
  dataTextBold: {
    fontWeight: "bold",
  },

  // Tabla de Conceptos
  tableContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#D1D5DB", // border-gray-300
    borderRadius: 8, // rounded-lg
    overflow: "hidden", // Para que los bordes redondeados se apliquen al contenido
    // boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm (difícil de replicar)
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6", // bg-gray-100
    color: "#4B5563", // text-gray-700
    paddingVertical: 12, // p-4
    fontSize: 9,
    textTransform: "uppercase", // uppercase
    fontWeight: "bold", // tracking-wider
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB", // border-gray-300
  },
  tableColHeaderDesc: {
    width: "35%",
    textAlign: "left",
    paddingHorizontal: 15,
  },
  tableColHeader: {
    width: "16.25%", // Para 4 columnas de datos + 1 de descripción (35% + 4 * 16.25% = 100%)
    textAlign: "right",
    paddingHorizontal: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB", // border-gray-200
    paddingVertical: 10, // p-4
    fontSize: 9,
  },
  tableRowOdd: {
    backgroundColor: "white", // bg-white
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB", // bg-gray-50
  },
  tableColDesc: {
    width: "35%",
    textAlign: "left",
    paddingHorizontal: 15,
  },
  tableCol: {
    width: "16.25%",
    textAlign: "right",
    paddingHorizontal: 15,
    fontWeight: "normal", // font-medium solo para el total del concepto
  },
  tableColTotalConcepto: {
    width: "16.25%",
    textAlign: "right",
    paddingHorizontal: 15,
    fontWeight: "bold", // font-medium
  },

  // Sección de Notas y Totales
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 30, // pt-8
    marginBottom: 0, // Ajustar si hay pie de página
    gap: 30, // gap-8
  },
  notesContainer: {
    flexGrow: 1,
    flexBasis: "48%",
    padding: 15, // p-5
    borderRadius: 8, // rounded-md
    backgroundColor: "#F9FAFB", // bg-gray-50
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
    lineHeight: 1.5,
  },
  notesTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    color: "#1F2937", // text-gray-900
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB", // border-gray-300
    paddingBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: "#4B5563", // text-gray-600
  },
  totalsCard: {
    flexDirection: "column",
    alignSelf: "flex-end", // align-items-end en flex
    width: "45%", // max-w-xs es difícil de traducir, usar porcentaje
    padding: 15, // p-5
    backgroundColor: "#F3F4F6", // bg-gray-100
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: "#D1D5DB", // border-gray-300
    // boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md (difícil de replicar)
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 10,
    color: "#4B5563", // text-gray-700
  },
  totalLabel: {
    fontWeight: "bold", // font-medium
  },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15, // pt-4 mt-4
    marginTop: 15, // pt-4 mt-4
    borderTopWidth: 2, // border-t-2
    borderTopColor: "#9CA3AF", // border-gray-400
    fontSize: 18, // text-xl
    fontWeight: "bold",
    color: "#1F2937", // text-gray-900
  },

  // Pie de página sutil
  footerBar: {
    backgroundColor: "#1F2937", // bg-gray-800
    height: 25, // h-8
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export function EstiloModernoPDF({ formData }: { formData: FormData }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: Concepto) => acc + c.cantidad * c.precio,
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const emisor = formData.emisor || {};
  const cliente = formData.cliente || {};

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Encabezado */}
        <View style={styles.headerContainer} fixed>
          <Text style={styles.headerTitle}>FACTURA</Text>
          <Text style={styles.headerNumber}>
            #{formData.numeroPresupuesto || "N/A"}
          </Text>
        </View>

        {/* Contenido principal de la factura */}
        <View style={styles.contentWrapper}>
          {/* Información de la factura y fechas */}
          <View style={styles.docDetailsGrid}>
            <View style={styles.docDetailColumn}>
              <Text style={styles.docDetailLabel}>Número de Presupuesto:</Text>
              <Text style={styles.docDetailText}>
                {formData.numeroPresupuesto || "N/A"}
              </Text>
            </View>
            <View style={styles.docDetailColumn}>
              <Text style={styles.docDetailLabel}>Fecha de Emisión:</Text>
              <Text style={styles.docDetailText}>
                {formData.fechaEmision || "N/A"}
              </Text>
            </View>
            <View style={styles.docDetailColumn}>
              <Text style={styles.docDetailLabel}>Fecha de Vencimiento:</Text>
              <Text style={styles.docDetailText}>
                {formData.fechaVencimiento || "N/A"}
              </Text>
            </View>
          </View>

          {/* Datos del Emisor y Cliente */}
          <View style={styles.dataGrid}>
            {/* Datos del Emisor */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Emitido por:</Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Nombre: </Text>
                {emisor.nombre}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>NIF: </Text>
                {emisor.nif}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Domicilio Fiscal: </Text>
                {emisor.direccion}
              </Text>
              <Text style={styles.dataText}>
                {emisor.cp} {emisor.ciudad}, {emisor.provincia}
              </Text>
              <Text style={styles.dataText}>{emisor.pais}</Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Tel: </Text>
                {emisor.telefono}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Email: </Text>
                {emisor.email}
              </Text>
            </View>

            {/* Datos del Cliente */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Facturado a:</Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Nombre: </Text>
                {cliente.nombre}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>NIF: </Text>
                {cliente.nif}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Domicilio Fiscal: </Text>
                {cliente.direccion}
              </Text>
              <Text style={styles.dataText}>
                {cliente.cp} {cliente.ciudad}, {cliente.provincia}
              </Text>
              <Text style={styles.dataText}>{cliente.pais}</Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Tel: </Text>
                {cliente.telefono}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataTextBold}>Email: </Text>
                {cliente.email}
              </Text>
            </View>
          </View>

          {/* Tabla de Conceptos */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableColHeaderDesc}>Descripción</Text>
              <Text style={styles.tableColHeader}>Cantidad</Text>
              <Text style={styles.tableColHeader}>Precio Unitario</Text>
              <Text style={styles.tableColHeader}>Total Concepto</Text>
            </View>
            {formData.conceptos.map((c: Concepto, i: number) => (
              <View
                style={[
                  styles.tableRow,
                  i % 2 === 0 ? styles.tableRowOdd : styles.tableRowEven,
                ]}
                key={i}
              >
                <Text style={styles.tableColDesc}>{c.descripcion}</Text>
                <Text style={styles.tableCol}>{c.cantidad}</Text>
                <Text style={styles.tableCol}>{c.precio.toFixed(2)}€</Text>
                <Text style={styles.tableColTotalConcepto}>
                  {(
                    c.cantidad *
                    c.precio 
                  ).toFixed(2)}
                  €
                </Text>
              </View>
            ))}
          </View>

          {/* Sección de Notas y Totales */}
          <View style={styles.summaryGrid}>
            {/* Notas / Forma de pago */}
            {formData.observaciones && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Notas / Forma de pago:</Text>
                <Text style={styles.notesText}>{formData.observaciones}</Text>
              </View>
            )}
            {/* Si no hay notas, los totales ocupan el espacio restante */}
            {!formData.observaciones && (
              <View style={{ flexGrow: 1, flexBasis: "48%" }}></View>
            )}

            {/* Totales */}
            <View style={styles.totalsCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Base Imponible:</Text>
                <Text>{subtotal.toFixed(2)}€</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  IVA ({formData.iva || 0}%):
                </Text>
                <Text>{iva.toFixed(2)}€</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Retención IRPF ({formData.irpf || 0}%):
                </Text>
                <Text>-{irpf.toFixed(2)}€</Text>
              </View>
              <View style={styles.finalTotalRow}>
                <Text>TOTAL:</Text>
                <Text>{total.toFixed(2)}€</Text>
              </View>
            </View>
          </View>
        </View>
        <FooterPDF
          numero={formData.numeroPresupuesto}
          total={total}
          vencimiento={formData.fechaVencimiento}
        />
      </Page>
    </Document>
  );
}
