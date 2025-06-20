"use client";

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { FooterPDF } from "@/components/pdf-footer"; // Asumo que tienes este componente

// Define las interfaces para asegurar el tipado de los datos
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

// Opcional: Registrar fuentes si quieres usar una fuente con 'serif' o personalizada
// Si quieres una fuente serif específica, necesitas los archivos .ttf y registrarlos.
// Por ejemplo, para Times New Roman (si tienes el archivo .ttf):
// Font.register({ family: 'Times New Roman', src: '/fonts/Times-New-Roman.ttf' });
// Font.register({ family: 'Times New Roman Bold', src: '/fonts/Times-New-Roman-Bold.ttf', fontWeight: 'bold' });


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica", // Por defecto, si no registras una fuente 'serif'
    color: '#333',
  },
  // Encabezado Clásico
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20, // pb-6
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF', // border-gray-400
    marginBottom: 25, // mb-8
  },
  headerTitle: {
    color: '#1F2937', // text-gray-900
    fontSize: 32, // text-4xl
    fontWeight: 'bold',
    letterSpacing: 0, // tracking-tight
    marginBottom: 5, // mb-2
  },
  headerSubtitle: {
    color: '#4B5563', // text-gray-600
    fontSize: 14, // text-lg
  },

  // Sección de Datos de Emisor y Cliente - Layout Clásico
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25, // space-y-8 general, gap-y-6
    gap: 40, // gap-x-12
  },
  dataColumn: {
    flexDirection: 'column',
    flexBasis: '48%', // Para 2 columnas con espacio
    gap: 5, // space-y-1
  },
  dataTitle: {
    fontWeight: 'bold',
    fontSize: 12, // text-base
    marginBottom: 8, // mb-2
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB', // border-gray-300
    paddingBottom: 4, // pb-1
    color: '#4B5563', // text-gray-700
  },
  dataText: {
    fontSize: 9, // Ajuste para el espacio
    lineHeight: 1.4,
  },
  dataTextBold: {
    fontWeight: 'bold',
  },

  // Detalles del Documento - Num, Fechas en una fila
  docDetailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 15, // pt-6
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB', // border-gray-300
    marginBottom: 25, // space-y-8
  },
  docNumberContainer: {
    flexDirection: 'column',
    gap: 4, // space-y-1
  },
  docNumberLabel: {
    color: '#4B5563', // text-gray-700
    fontSize: 9,
  },
  docNumberValue: {
    fontWeight: 'bold',
    fontSize: 16, // text-lg
  },
  docDatesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4, // space-y-1
    fontSize: 9,
  },
  docDateLabel: {
    color: '#4B5563', // text-gray-700
  },

  // Tabla de Conceptos
  tableContainer: {
    marginBottom: 25, // space-y-8
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 2, // rounded-sm
    overflow: 'hidden', // Para el border-radius
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // bg-gray-100
    color: '#4B5563', // text-gray-700
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 9,
  },
  tableHeaderCell: {
    paddingVertical: 8, // p-3
    paddingHorizontal: 5, // Ajuste de padding
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB', // border-gray-300
    textAlign: 'left', // Por defecto, luego se ajusta
  },
  tableHeaderCellRight: {
    paddingVertical: 8,
    paddingHorizontal: 5, // Ajuste de padding
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    textAlign: 'right',
  },
  tableHeaderCellLast: {
    paddingVertical: 8,
    paddingHorizontal: 5, // Ajuste de padding
    textAlign: 'right', // No hay border-r en el último
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  tableCell: {
    paddingVertical: 8, // p-3
    paddingHorizontal: 5, // Ajuste de padding
    borderRightWidth: 0.5,
    borderRightColor: '#E5E7EB', // border-gray-200
    textAlign: 'left', // Por defecto, luego se ajusta
    fontSize: 9,
  },
  tableCellRight: {
    paddingVertical: 8,
    paddingHorizontal: 5, // Ajuste de padding
    borderRightWidth: 0.5,
    borderRightColor: '#E5E7EB',
    textAlign: 'right',
    fontSize: 9,
  },
  tableCellLast: {
    paddingVertical: 8,
    paddingHorizontal: 5, // Ajuste de padding
    textAlign: 'right', // No hay border-r en el último
    fontSize: 9,
  },
  // Anchos de columna de la tabla
  colDesc: { width: '35%' },
  colQty: { width: '15%' },
  colPrice: { width: '15%' },
  colDiscount: { width: '15%' },
  colTotal: { width: '20%' },

  // Sección de Notas y Totales
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15, // pt-6
    marginBottom: 0,
    gap: 40, // gap-x-12
  },
  notesContainer: {
    flexGrow: 1,
    flexBasis: '48%',
    gap: 4, // space-y-1
  },
  notesTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 4,
    color: '#4B5563',
  },
  notesText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  totalsContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-end', // items-end
    width: '45%', // max-w-xs es difícil de traducir, usar porcentaje
    padding: 15, // p-4
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 2, // rounded-sm
    gap: 8, // space-y-2
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    color: '#4B5563', // text-gray-700
  },
  totalLabel: {
    fontWeight: 'bold', // font-medium
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15, // pt-4 mt-4
    marginTop: 15, // pt-4 mt-4
    borderTopWidth: 1, // border-t
    borderTopColor: '#9CA3AF', // border-gray-400
    fontSize: 18, // text-xl
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-900
  },
});


export function EstiloClasicoPDF({ formData }: { formData: FormData }) {
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
        {/* Encabezado Clásico */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>FACTURA</Text>
          <Text style={styles.headerSubtitle}>Su documento comercial</Text>
        </View>

        {/* Sección de Datos de Emisor y Cliente */}
        <View style={styles.dataGrid}>
          {/* Datos del Emisor */}
          <View style={styles.dataColumn}>
            <Text style={styles.dataTitle}>De:</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>{emisor.nombre}</Text></Text>
            <Text style={styles.dataText}>{emisor.direccion}</Text>
            <Text style={styles.dataText}>{emisor.cp} {emisor.ciudad}, {emisor.provincia}</Text>
            <Text style={styles.dataText}>{emisor.pais}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>NIF: </Text>{emisor.nif}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>Tel: </Text>{emisor.telefono}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>Email: </Text>{emisor.email}</Text>
          </View>

          {/* Datos del Cliente */}
          <View style={styles.dataColumn}>
            <Text style={styles.dataTitle}>Para:</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>{cliente.nombre}</Text></Text>
            <Text style={styles.dataText}>{cliente.direccion}</Text>
            <Text style={styles.dataText}>{cliente.cp} {cliente.ciudad}, {cliente.provincia}</Text>
            <Text style={styles.dataText}>{cliente.pais}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>NIF: </Text>{cliente.nif}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>Tel: </Text>{cliente.telefono}</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>Email: </Text>{cliente.email}</Text>
          </View>
        </View>

        {/* Detalles del Documento - Num, Fechas en una fila */}
        <View style={styles.docDetailsSection}>
          <View style={styles.docNumberContainer}>
            <Text style={styles.docNumberLabel}>Número de Factura:</Text>
            <Text style={styles.docNumberValue}>{formData.numeroPresupuesto || "N/A"}</Text>
          </View>
          <View style={styles.docDatesContainer}>
            <Text style={styles.docDateLabel}><Text style={styles.dataTextBold}>Fecha de Emisión: </Text>{formData.fechaEmision || "N/A"}</Text>
            <Text style={styles.docDateLabel}><Text style={styles.dataTextBold}>Fecha de Vencimiento: </Text>{formData.fechaVencimiento || "N/A"}</Text>
          </View>
        </View>

        {/* Tabla de Conceptos */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tableHeaderCellRight, styles.colQty]}>Cantidad</Text>
            <Text style={[styles.tableHeaderCellRight, styles.colPrice]}>Precio Unitario</Text>
            <Text style={[styles.tableHeaderCellLast, styles.colTotal]}>Importe</Text>
          </View>
          {formData.conceptos.map((c: Concepto, i: number) => (
            <View style={[styles.tableRow, i % 2 === 0 ? styles.tableRowOdd : styles.tableRowEven]} key={i}>
              <Text style={[styles.tableCell, styles.colDesc]}>{c.descripcion}</Text>
              <Text style={[styles.tableCellRight, styles.colQty]}>{c.cantidad}</Text>
              <Text style={[styles.tableCellRight, styles.colPrice]}>{c.precio.toFixed(2)}€</Text>
              <Text style={[styles.tableCellLast, styles.colTotal]}>
                {(c.cantidad * c.precio).toFixed(2)}€
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
          {/* Ocupa el espacio si no hay notas, para alinear Totales a la derecha */}
          {!formData.observaciones && <View style={{flexGrow: 1, flexBasis: '48%'}}></View>}


          {/* Totales */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Base Imponible:</Text>
              <Text>{subtotal.toFixed(2)}€</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA ({formData.iva || 0}%):</Text>
              <Text>{iva.toFixed(2)}€</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Retención IRPF ({formData.irpf || 0}%):</Text>
              <Text>-{irpf.toFixed(2)}€</Text>
            </View>
            <View style={styles.finalTotalRow}>
              <Text>TOTAL A PAGAR:</Text>
              <Text>{total.toFixed(2)}€</Text>
            </View>
          </View>
        </View>

        {/* Pie de página sutil (fixed en la parte inferior) */}
        <View style={styles.footerBar} fixed></View>
        <FooterPDF
          numero={formData.numeroPresupuesto}
          total={total}
          vencimiento={formData.fechaVencimiento}
        />
      </Page>
    </Document>
  );
}
