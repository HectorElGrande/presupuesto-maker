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
  descuento?: number; // Aunque no se muestra, puede existir en los datos
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

// Opcional: Registrar fuentes si quieres usar una fuente 'sans' personalizada como Inter
// Asegúrate de que los archivos .ttf estén accesibles en tu ruta pública (ej: /public/fonts/)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });
// Font.register({ family: 'Inter Light', src: '/fonts/Inter-Light.ttf', fontWeight: 'light' });
// Font.register({ family: 'Inter Medium', src: '/fonts/Inter-Medium.ttf', fontWeight: 'medium' });


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica", // Por defecto, si no registras una fuente 'sans'
    color: '#333',
  },
  // Encabezado Minimalista: Solo título y número
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB', // border-gray-300
    paddingBottom: 20, // pb-6
    marginBottom: 25, // mb-8
  },
  headerTitle: {
    color: '#1F2937', // text-gray-900
    fontSize: 32, // text-4xl
    fontWeight: 'light', // font-light
    letterSpacing: 0, // tracking-tight
  },
  headerNumberSection: {
    textAlign: 'right',
  },
  headerNumberLabel: {
    color: '#4B5563', // text-gray-600
    fontSize: 9,
  },
  headerNumberValue: {
    color: '#1F2937', // text-gray-900
    fontSize: 20, // text-2xl
    fontWeight: 'medium', // font-medium
  },

  // Información de la factura y fechas - Alineada a la derecha
  dateInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25, // mb-8
  },
  dateInfoText: {
    textAlign: 'right',
    fontSize: 9,
    color: '#4B5563', // text-gray-700
    lineHeight: 1.4,
  },
  dateInfoLabel: {
    fontWeight: 'medium', // font-medium
  },


  // Datos de Emisor y Cliente - En bloques, con líneas de separación
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30, // mb-10
    gap: 40, // gap-x-12
  },
  dataColumn: {
    flexDirection: 'column',
    flexBasis: '48%', // Para 2 columnas con espacio
    gap: 5, // space-y-1
  },
  dataTitle: {
    fontWeight: 'bold', // font-semibold
    fontSize: 12, // text-base
    marginBottom: 8, // mb-2
    paddingBottom: 4, // pb-1
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB', // border-gray-300
    color: '#4B5563', // text-gray-700
  },
  dataText: {
    fontSize: 9, // Ajuste para el espacio
    lineHeight: 1.4,
  },
  dataTextBold: {
    fontWeight: 'medium', // font-medium
  },

  // Tabla de Conceptos - Líneas sutiles, sin fondos llamativos
  tableContainer: {
    borderTopWidth: 1, // border-y
    borderBottomWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    marginBottom: 30, // mb-8
  },
  tableHeaderRow: {
    flexDirection: 'row',
    color: '#4B5563', // text-gray-700
    fontWeight: 'normal', // font-normal
    textTransform: 'uppercase',
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB', // border-gray-300
  },
  tableHeaderCell: {
    paddingVertical: 10, // p-3
    paddingHorizontal: 8, // <-- Añadido padding horizontal
    textAlign: 'right',
  },
  tableHeaderCellDesc: {
    paddingVertical: 10,
    paddingHorizontal: 8, // <-- Añadido padding horizontal
    textAlign: 'left',
    width: '40%', // Ajuste de ancho
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  tableRowLast: {
    borderBottomWidth: 0, // last:border-b-0
  },
  tableCell: {
    paddingVertical: 10, // p-3
    paddingHorizontal: 8, // <-- Añadido padding horizontal
    textAlign: 'right',
    fontSize: 9,
    color: '#444',
  },
  tableCellDesc: {
    paddingVertical: 10,
    paddingHorizontal: 8, // <-- Añadido padding horizontal
    textAlign: 'left',
    width: '40%', // Ajuste de ancho
    fontSize: 9,
    color: '#444',
  },
  tableCellTotal: {
    fontWeight: 'medium', // font-medium
  },
  // Anchos de columna de la tabla (ajustados para 4 columnas)
  colDesc: { width: '40%' },
  colQty: { width: '20%' },
  colPrice: { width: '20%' },
  colTotal: { width: '20%' },


  // Sección de Notas y Totales - Columnas
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
    fontWeight: 'bold', // font-semibold
    fontSize: 12,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB', // border-gray-300
    color: '#4B5563', // text-gray-700
  },
  notesText: {
    fontSize: 9,
    color: '#4B5563', // text-gray-600
    lineHeight: 1.4,
  },
  totalsContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-end', // items-end
    width: '45%', // max-w-xs es difícil de traducir, usar porcentaje
    paddingVertical: 15, // py-4
    borderTopWidth: 2, // border-t-2
    borderTopColor: '#9CA3AF', // border-gray-400
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
    fontWeight: 'normal', // font-light
  },
  totalValue: {
    fontWeight: 'normal', // font-normal
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15, // pt-4 mt-4
    marginTop: 15, // pt-4 mt-4
    fontWeight: 'normal', // font-normal
    fontSize: 18, // text-xl
    color: '#1F2937', // text-gray-900
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB', // border-gray-300
  },
  finalTotalValue: {
    fontWeight: 'bold', // font-semibold
  },
});


export function EstiloMinimalPDF({ formData }: { formData: FormData }) {
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
        {/* Encabezado Minimalista: Solo título y número */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>FACTURA</Text>
          <View style={styles.headerNumberSection}>
            <Text style={styles.headerNumberLabel}>Número de Factura:</Text>
            <Text style={styles.headerNumberValue}>#{formData.numeroPresupuesto || "N/A"}</Text>
          </View>
        </View>

        {/* Información de la factura y fechas - Alineada a la derecha */}
        <View style={styles.dateInfoContainer}>
          <View>
            <Text style={styles.dateInfoText}><Text style={styles.dateInfoLabel}>Fecha de Emisión: </Text>{formData.fechaEmision || "N/A"}</Text>
            <Text style={styles.dateInfoText}><Text style={styles.dateInfoLabel}>Fecha de Vencimiento: </Text>{formData.fechaVencimiento || "N/A"}</Text>
          </View>
        </View>

        {/* Datos de Emisor y Cliente - En bloques, con líneas de separación */}
        <View style={styles.dataGrid}>
          {/* Datos del Emisor */}
          <View style={styles.dataColumn}>
            <Text style={styles.dataTitle}>De:</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>{emisor.nombre}</Text></Text>
            <Text style={styles.dataText}>{emisor.direccion}</Text>
            <Text style={styles.dataText}>{emisor.cp} {emisor.ciudad}, {emisor.provincia}</Text>
            <Text style={styles.dataText}>{emisor.pais}</Text>
            <Text style={styles.dataText}>NIF: {emisor.nif}</Text>
            <Text style={styles.dataText}>Tel: {emisor.telefono}</Text>
            <Text style={styles.dataText}>Email: {emisor.email}</Text>
          </View>

          {/* Datos del Cliente */}
          <View style={styles.dataColumn}>
            <Text style={styles.dataTitle}>Para:</Text>
            <Text style={styles.dataText}><Text style={styles.dataTextBold}>{cliente.nombre}</Text></Text>
            <Text style={styles.dataText}>{cliente.direccion}</Text>
            <Text style={styles.dataText}>{cliente.cp} {cliente.ciudad}, {cliente.provincia}</Text>
            <Text style={styles.dataText}>{cliente.pais}</Text>
            <Text style={styles.dataText}>NIF: {cliente.nif}</Text>
            <Text style={styles.dataText}>Tel: {cliente.telefono}</Text>
            <Text style={styles.dataText}>Email: {cliente.email}</Text>
          </View>
        </View>

        {/* Tabla de Conceptos */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderCellDesc}>Descripción</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Cantidad</Text> {/* Aplicar ancho aquí */}
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Precio Unitario</Text> {/* Aplicar ancho aquí */}
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Importe</Text> {/* Aplicar ancho aquí */}
          </View>
          {formData.conceptos.map((c: Concepto, i: number) => (
            <View style={[styles.tableRow, i === formData.conceptos.length - 1 ? styles.tableRowLast : {}]} key={i}>
              <Text style={styles.tableCellDesc}>{c.descripcion}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{c.cantidad}</Text> {/* Aplicar ancho aquí */}
              <Text style={[styles.tableCell, styles.colPrice]}>{c.precio.toFixed(2)}€</Text> {/* Aplicar ancho aquí */}
              <Text style={[styles.tableCell, styles.tableCellTotal, styles.colTotal]}> {/* Aplicar ancho aquí */}
                {(c.cantidad * c.precio).toFixed(2)}€
              </Text>
            </View>
          ))}
        </View>

        {/* Sección de Notas y Totales - Columnas */}
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
              <Text style={styles.totalValue}>{subtotal.toFixed(2)}€</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA ({formData.iva || 0}%):</Text>
              <Text style={styles.totalValue}>{iva.toFixed(2)}€</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Retención IRPF ({formData.irpf || 0}%):</Text>
              <Text style={styles.totalValue}>-{irpf.toFixed(2)}€</Text>
            </View>
            <View style={styles.finalTotalRow}>
              <Text>TOTAL A PAGAR:</Text>
              <Text style={styles.finalTotalValue}>{total.toFixed(2)}€</Text>
            </View>
          </View>
        </View>
        {/* Aquí podrías integrar un FooterPDF si lo tienes */}
        <FooterPDF
          numero={formData.numeroPresupuesto}
          total={total}
          vencimiento={formData.fechaVencimiento}
        />
      </Page>
    </Document>
  );
}
