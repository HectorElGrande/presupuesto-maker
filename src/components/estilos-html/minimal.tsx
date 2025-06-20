import React from 'react';

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

export function EstiloMinimalHTML({ formData }: { formData: FormData }) {
  // Calcula los totales basados en el formData
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
    <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 text-sm font-sans overflow-hidden border border-gray-100">
      {/* Encabezado Minimalista: Solo título y número */}
      <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-8">
        <h1 className="text-gray-900 text-4xl font-light tracking-tight">FACTURA</h1>
        <div className="text-right">
          <p className="text-gray-600">Número de Factura:</p>
          <p className="text-gray-900 text-2xl font-medium">{formData.numeroPresupuesto || "N/A"}</p>
        </div>
      </div>

      {/* Información de la factura y fechas - Alineada a la derecha */}
      <div className="flex justify-end mb-8">
        <div className="text-right space-y-1 text-gray-700">
          <p><strong className="font-medium">Fecha de Emisión:</strong> {formData.fechaEmision || "N/A"}</p>
          <p><strong className="font-medium">Fecha de Vencimiento:</strong> {formData.fechaVencimiento || "N/A"}</p>
        </div>
      </div>

      {/* Datos del Emisor y Cliente - En bloques, con líneas de separación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
        {/* Datos del Emisor */}
        <div className="space-y-1">
          <h2 className="font-semibold text-base mb-2 pb-1 border-b border-gray-300 text-gray-700">De:</h2>
          <p className="font-medium">{emisor.nombre}</p>
          <p>{emisor.direccion}</p>
          <p>{emisor.cp} {emisor.ciudad}, {emisor.provincia}</p>
          <p>{emisor.pais}</p>
          <p>NIF: {emisor.nif}</p>
          <p>Tel: {emisor.telefono}</p>
          <p>Email: {emisor.email}</p>
        </div>

        {/* Datos del Cliente */}
        <div className="space-y-1">
          <h2 className="font-semibold text-base mb-2 pb-1 border-b border-gray-300 text-gray-700">Para:</h2>
          <p className="font-medium">{cliente.nombre}</p>
          <p>{cliente.direccion}</p>
          <p>{cliente.cp} {cliente.ciudad}, {cliente.provincia}</p>
          <p>{cliente.pais}</p>
          <p>NIF: {cliente.nif}</p>
          <p>Tel: {cliente.telefono}</p>
          <p>Email: {cliente.email}</p>
        </div>
      </div>

      {/* Tabla de Conceptos - Líneas sutiles, sin fondos llamativos */}
      <div className="overflow-x-auto border-y border-gray-300 mb-8">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="text-gray-700 uppercase font-normal text-left border-b border-gray-300">
              <th className="p-3">Descripción</th>
              <th className="p-3 text-right">Cantidad</th>
              <th className="p-3 text-right">Precio Unitario</th>
              {/* <th className="p-3 text-right">Descuento</th> */} {/* Eliminado */}
              <th className="p-3 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {formData.conceptos.map((c: Concepto, i: number) => (
              <tr key={i} className="border-b border-gray-200 last:border-b-0">
                <td className="p-3">{c.descripcion}</td>
                <td className="p-3 text-right">{c.cantidad}</td>
                <td className="p-3 text-right">{c.precio.toFixed(2)}€</td>
                {/* <td className="p-3 text-right">{(c.descuento || 0).toFixed(0)}%</td> */} {/* Eliminado */}
                <td className="p-3 text-right font-medium">
                  {(c.cantidad * c.precio * (1 - (c.descuento || 0) / 100)).toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Notas y Totales - Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6">
        {/* Notas / Forma de pago */}
        {formData.observaciones && (
          <div className="space-y-1">
            <h3 className="font-semibold text-base mb-2 pb-1 border-b border-gray-300 text-gray-700">Notas / Forma de pago:</h3>
            <p className="text-gray-600 leading-relaxed">{formData.observaciones}</p>
          </div>
        )}
        {/* Ocupa el espacio si no hay notas, para alinear Totales a la derecha */}
        {!formData.observaciones && <div className="md:col-span-1"></div>}


        {/* Totales */}
        <div className="flex flex-col items-end w-full">
          <div className="w-full max-w-xs space-y-2 py-4 border-t-2 border-gray-400">
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-light">Base Imponible:</span>
              <span className="font-normal">{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-light">IVA ({formData.iva || 0}%):</span>
              <span className="font-normal">{iva.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-light">Retención IRPF ({formData.irpf || 0}%):</span>
              <span className="font-normal">-{irpf.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 font-normal text-xl text-gray-900 border-t border-gray-300">
              <span>TOTAL A PAGAR:</span>
              <span className="font-semibold">{total.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
