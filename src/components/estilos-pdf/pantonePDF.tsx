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

// Definición de tipos (repetida para asegurar la independencia del componente PDF)
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
  // Puedes añadir más campos de estilo si los gestionas aquí
  // estilo: string;
  // logo: string;
  // mostrarLogo: boolean;
  // tamanoLogo: string;
}

// Registrar fuentes si quieres usar una fuente personalizada
// Por defecto, @react-pdf/renderer usa Helvetica. Para otras, necesitas registrarlas.
// Por ejemplo, para Inter (si tienes el archivo .ttf):
// Font.register({
//   family: 'Inter',
//   src: '/fonts/Inter-Regular.ttf', // Asegúrate de que esta ruta sea accesible
// });
// Font.register({
//   family: 'Inter Bold',
//   src: '/fonts/Inter-Bold.ttf',
//   fontWeight: 'bold',
// });


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica", // Cambia a 'Inter' si registraste la fuente
    color: '#333',
  },
  // Encabezado
  headerContainer: {
    backgroundColor: '#6B4E99', // Color púrpura principal
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    position: 'relative', // Para el elemento decorativo
    overflow: 'hidden', // Asegura que el skew no se salga del contenedor
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerAccent: {
    position: 'absolute',
    right: -20, // Ajusta esto para mover el acento
    width: '40%',
    height: '100%',
    backgroundColor: '#5B8FF9', // Acento azul
    transform: 'skewX(-20deg)', // Ángulo para el efecto inclinado
    // Las propiedades de transformación son ligeramente diferentes en react-pdf
    // transform: 'rotate(5deg)', // O probar con rotación si skewX no es exacto
  },

  // Contenido principal
  contentSection: {
    padding: 30,
    paddingTop: 20, // Ajuste para el espacio después del encabezado
  },

  // Datos de Emisor y Cliente
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 20, // Espacio entre las columnas
  },
  dataCard: {
    flexGrow: 1, // Permite que las tarjetas crezcan
    flexBasis: '48%', // Un poco menos de la mitad para el gap
    backgroundColor: '#F7F7F7', // Gris claro
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dataCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6B4E99',
    borderBottomWidth: 1,
    borderBottomColor: '#6B4E99',
    paddingBottom: 4,
  },
  dataText: {
    marginBottom: 2,
    fontSize: 9, // Texto más pequeño para detalle
    lineHeight: 1.4,
  },
  dataLabel: {
    fontWeight: 'bold',
    color: '#555',
  },

  // Sección de Fechas y Número de Presupuesto
  docDetailsContainer: {
    backgroundColor: '#E0E2EC', // Color de fondo gris-púrpura claro
    padding: 15,
    borderRadius: 8,
    alignSelf: 'flex-end', // Alineado a la derecha
    width: '50%', // Ocupa la mitad del ancho
    marginBottom: 25,
  },
  docDetailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6B4E99',
    borderBottomWidth: 1,
    borderBottomColor: '#6B4E99',
    paddingBottom: 4,
    textAlign: 'right',
  },
  docDetailsText: {
    fontSize: 9,
    textAlign: 'right',
    marginBottom: 2,
    color: '#555',
  },

  // Tabla de Conceptos
  tableContainer: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    overflow: 'hidden', // Para los bordes redondeados de la tabla
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#6B4E99',
    color: 'white',
    paddingVertical: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCellHeader: {
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  tableDescHeader: {
    paddingHorizontal: 8,
    width: '35%', // Ancho ajustado
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  tableRowOdd: {
    backgroundColor: '#FDFDFD', // Fondo blanco para filas impares
  },
  tableRowEven: {
    backgroundColor: '#F7F7F7', // Fondo gris claro para filas pares
  },
  tableCell: {
    width: '16.25%', // Ancho para 4 columnas de datos + 1 de descripción
    paddingHorizontal: 8,
    textAlign: 'right',
    fontSize: 9,
    color: '#444',
  },
  tableDescCell: {
    width: '35%', // Ancho ajustado
    paddingHorizontal: 8,
    textAlign: 'left',
    fontSize: 9,
    color: '#444',
  },

  // Totales y Notas
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 20,
  },
  notesContainer: {
    flexGrow: 1,
    flexBasis: '48%',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6B4E99',
    borderBottomWidth: 1,
    borderBottomColor: '#6B4E99',
    paddingBottom: 4,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#666',
  },
  totalsCard: {
    width: '45%', // Un poco más pequeño que las notas para dejar espacio
    backgroundColor: '#F5EEFF', // Un morado muy claro
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    alignSelf: 'flex-end', // Alineado a la derecha
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 10,
    color: '#555',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#999',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2D73', // Un púrpura más oscuro para el total final
  },
});

export function EstiloPantonePDF({ formData }: { formData: FormData }) {
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
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>FACTURA</Text>
          <Text style={styles.headerNumber}>#{formData.numeroPresupuesto || "N/A"}</Text>
          {/* Elemento decorativo inclinado - Puede que necesite ajustes visuales precisos */}
          <View style={styles.headerAccent}></View>
        </View>

        <View style={styles.contentSection}>
          {/* Datos de Emisor y Cliente */}
          <View style={styles.dataGrid}>
            {/* Datos del Emisor */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Emitido por:</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Nombre: </Text>{emisor.nombre}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>NIF: </Text>{emisor.nif}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Domicilio Fiscal: </Text>{emisor.direccion}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>C.P.: </Text>{emisor.cp}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Ciudad: </Text>{emisor.ciudad}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Provincia: </Text>{emisor.provincia}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>País: </Text>{emisor.pais}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Teléfono: </Text>{emisor.telefono}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Email: </Text>{emisor.email}</Text>
            </View>

            {/* Datos del Cliente */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Facturado a:</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Nombre: </Text>{cliente.nombre}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>NIF: </Text>{cliente.nif}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Domicilio Fiscal: </Text>{cliente.direccion}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>C.P.: </Text>{cliente.cp}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Ciudad: </Text>{cliente.ciudad}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Provincia: </Text>{cliente.provincia}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>País: </Text>{cliente.pais}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Teléfono: </Text>{cliente.telefono}</Text>
              <Text style={styles.dataText}><Text style={styles.dataLabel}>Email: </Text>{cliente.email}</Text>
            </View>
          </View>

          {/* Sección de Fechas y Número de Presupuesto - Alineada a la derecha */}
          <View style={styles.docDetailsContainer}>
            <Text style={styles.docDetailsTitle}>Detalles del Presupuesto</Text>
            <Text style={styles.docDetailsText}><Text style={styles.dataLabel}>Fecha de emisión: </Text>{formData.fechaEmision || "N/A"}</Text>
            <Text style={styles.docDetailsText}><Text style={styles.dataLabel}>Fecha de vencimiento: </Text>{formData.fechaVencimiento || "N/A"}</Text>
          </View>

          {/* Tabla de Conceptos */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableDescHeader}>Descripción</Text>
              <Text style={styles.tableCellHeader}>Cantidad</Text>
              <Text style={styles.tableCellHeader}>Precio Unitario</Text>
              <Text style={styles.tableCellHeader}>Importe</Text>
            </View>
            {formData.conceptos.map((c: Concepto, i: number) => (
              <View style={[styles.tableRow, i % 2 === 0 ? styles.tableRowOdd : styles.tableRowEven]} key={i}>
                <Text style={styles.tableDescCell}>{c.descripcion}</Text>
                <Text style={styles.tableCell}>{c.cantidad}</Text>
                <Text style={styles.tableCell}>{c.precio.toFixed(2)}€</Text>
                <Text style={styles.tableCell}>
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
            {/* Totales */}
            <View style={styles.totalsCard}>
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
                <Text>TOTAL:</Text>
                <Text>{total.toFixed(2)}€</Text>
              </View>
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
