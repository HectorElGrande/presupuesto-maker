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

export function EstiloClasicoHTML({ formData }: { formData: FormData }) {
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
    <div className="bg-white p-8 rounded-lg shadow-xl text-gray-800 text-sm font-serif overflow-hidden border border-gray-200">
      {/* Encabezado Clásico */}
      <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-400 mb-8">
        <h1 className="text-gray-900 text-4xl font-bold tracking-tight mb-2">FACTURA</h1>
        <p className="text-gray-600 text-lg">Su documento comercial</p>
      </div>

      <div className="space-y-8">
        {/* Sección de Datos de Emisor y Cliente - Layout Clásico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Datos del Emisor */}
          <div className="space-y-1">
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1 text-gray-700">De:</h2>
            <p className="font-semibold">{emisor.nombre}</p>
            <p>{emisor.direccion}</p>
            <p>{emisor.cp} {emisor.ciudad}, {emisor.provincia}</p>
            <p>{emisor.pais}</p>
            <p>NIF: {emisor.nif}</p>
            <p>Tel: {emisor.telefono}</p>
            <p>Email: {emisor.email}</p>
          </div>

          {/* Datos del Cliente */}
          <div className="space-y-1">
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1 text-gray-700">Para:</h2>
            <p className="font-semibold">{cliente.nombre}</p>
            <p>{cliente.direccion}</p>
            <p>{cliente.cp} {cliente.ciudad}, {cliente.provincia}</p>
            <p>{cliente.pais}</p>
            <p>NIF: {cliente.nif}</p>
            <p>Tel: {cliente.telefono}</p>
            <p>Email: {cliente.email}</p>
          </div>
        </div>

        {/* Detalles del Documento - Num, Fechas en una fila */}
        <div className="flex justify-between items-start pt-6 border-t border-gray-300">
          <div className="space-y-1">
            <p><strong className="text-gray-700">Número de Factura:</strong></p>
            <p className="font-semibold text-lg">{formData.numeroPresupuesto || "N/A"}</p>
          </div>
          <div className="text-right space-y-1">
            <p><strong className="text-gray-700">Fecha de Emisión:</strong> {formData.fechaEmision || "N/A"}</p>
            <p><strong className="text-gray-700">Fecha de Vencimiento:</strong> {formData.fechaVencimiento || "N/A"}</p>
          </div>
        </div>

        {/* Tabla de Conceptos - Estilo Clásico con bordes */}
        <div className="overflow-x-auto border border-gray-300 rounded-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-left">
                <th className="p-3 border-r border-gray-300">Descripción</th>
                <th className="p-3 border-r border-gray-300 text-right">Cantidad</th>
                <th className="p-3 border-r border-gray-300 text-right">Precio Unitario</th>
                <th className="p-3 border-r border-gray-300 text-right">Descuento</th>
                <th className="p-3 text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {formData.conceptos.map((c: Concepto, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-3 border-r border-gray-200">{c.descripcion}</td>
                  <td className="p-3 border-r border-gray-200 text-right">{c.cantidad}</td>
                  <td className="p-3 border-r border-gray-200 text-right">{c.precio.toFixed(2)}€</td>
                  <td className="p-3 border-r border-gray-200 text-right">{(c.descuento || 0).toFixed(0)}%</td>
                  <td className="p-3 text-right">
                    {(c.cantidad * c.precio * (1 - (c.descuento || 0) / 100)).toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección de Notas y Totales - Distribución en columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6">
          {/* Notas / Forma de pago */}
          {formData.observaciones && (
            <div className="space-y-1">
              <h3 className="font-bold text-base mb-2 border-b border-gray-300 pb-1 text-gray-700">Notas / Forma de pago:</h3>
              <p className="text-gray-600 leading-relaxed">{formData.observaciones}</p>
            </div>
          )}
          {/* Ocupa el espacio si no hay notas, para alinear Totales a la derecha */}
          {!formData.observaciones && <div className="md:col-span-1"></div>}


          {/* Totales */}
          <div className="flex flex-col items-end w-full">
            <div className="w-full max-w-xs space-y-2 p-4 border border-gray-300 rounded-sm">
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Base Imponible:</span>
                <span className="font-semibold">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">IVA ({formData.iva || 0}%):</span>
                <span className="font-semibold">{iva.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Retención IRPF ({formData.irpf || 0}%):</span>
                <span className="font-semibold">-{irpf.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 font-bold text-xl text-gray-900 border-t border-gray-400">
                <span>TOTAL A PAGAR:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
