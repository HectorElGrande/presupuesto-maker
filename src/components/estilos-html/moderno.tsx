import React from 'react';

// Define las interfaces para asegurar el tipado de los datos
interface Concepto {
  cantidad: number;
  descripcion: string;
  precio: number; // Asumo que se llama 'precio' en los datos reales
  descuento?: number; // Puede ser opcional si no todos los conceptos lo tienen
  importe?: number; // Puede ser opcional si se calcula siempre
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

export function EstiloModernoHTML({ formData }: { formData: FormData }) {
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
    <div className="bg-white rounded-lg shadow-2xl text-gray-800 text-sm font-sans overflow-hidden border border-gray-100">
      {/* Encabezado elegante y minimalista */}
      <div className="bg-gray-900 h-20 w-full flex items-center justify-between px-8 py-4">
        <h1 className="text-white font-extrabold text-3xl tracking-widest uppercase">Factura</h1>
        <span className="text-white text-lg font-semibold opacity-80">#{formData.numeroPresupuesto || "N/A"}</span>
      </div>

      <div className="p-8 space-y-8">
        {/* Información de la factura y fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 border-b pb-6 border-gray-200">
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">Número de Presupuesto:</p>
            <p>{formData.numeroPresupuesto || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">Fecha de Emisión:</p>
            <p>{formData.fechaEmision || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">Fecha de Vencimiento:</p>
            <p>{formData.fechaVencimiento || "N/A"}</p>
          </div>
        </div>

        {/* Datos del Emisor y Cliente en un layout más limpio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Datos del Emisor */}
          <div className="space-y-3 p-5 rounded-md bg-gray-50 border border-gray-200">
            <h2 className="font-bold text-lg mb-2 text-gray-900 border-b border-gray-300 pb-2">Emitido por:</h2>
            <p className="font-semibold">{emisor.nombre}</p>
            <p>NIF: {emisor.nif}</p>
            <p>{emisor.direccion}</p>
            <p>{emisor.cp} {emisor.ciudad}, {emisor.provincia}</p>
            <p>{emisor.pais}</p>
            <p>Tel: {emisor.telefono}</p>
            <p>Email: {emisor.email}</p>
          </div>

          {/* Datos del Cliente */}
          <div className="space-y-3 p-5 rounded-md bg-gray-50 border border-gray-200">
            <h2 className="font-bold text-lg mb-2 text-gray-900 border-b border-gray-300 pb-2">Facturado a:</h2>
            <p className="font-semibold">{cliente.nombre}</p>
            <p>NIF: {cliente.nif}</p>
            <p>{cliente.direccion}</p>
            <p>{cliente.cp} {cliente.ciudad}, {cliente.provincia}</p>
            <p>{cliente.pais}</p>
            <p>Tel: {cliente.telefono}</p>
            <p>Email: {cliente.email}</p>
          </div>
        </div>

        {/* Tabla de Conceptos */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm mt-8">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="text-left p-4 border-b border-gray-300 rounded-tl-lg">Descripción</th>
                <th className="text-right p-4 border-b border-gray-300">Cantidad</th>
                <th className="text-right p-4 border-b border-gray-300">Precio Unitario</th>
                {/* Asumiendo que el descuento se puede mostrar */}
                <th className="text-right p-4 border-b border-gray-300">Descuento</th>
                <th className="text-right p-4 border-b border-gray-300 rounded-tr-lg">Total Concepto</th>
              </tr>
            </thead>
            <tbody>
              {formData.conceptos.map((c: Concepto, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 border-b border-gray-200">{c.descripcion}</td>
                  <td className="p-4 border-b border-gray-200 text-right">{c.cantidad}</td>
                  <td className="p-4 border-b border-gray-200 text-right">{c.precio.toFixed(2)}€</td>
                  <td className="p-4 border-b border-gray-200 text-right">{(c.descuento || 0).toFixed(0)}%</td>
                  <td className="p-4 border-b border-gray-200 text-right font-medium">
                    {(c.cantidad * c.precio * (1 - (c.descuento || 0) / 100)).toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección de Totales y Notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Notas / Forma de pago */}
          {formData.observaciones && (
            <div className="space-y-3 p-5 rounded-md bg-gray-50 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-900 border-b border-gray-300 pb-2">Notas / Forma de pago:</h3>
              <p className="text-gray-600 leading-relaxed">{formData.observaciones}</p>
            </div>
          )}
          {/* Ajustar el span si no hay notas para que los totales ocupen todo el ancho */}
          {!formData.observaciones && <div className="md:col-span-1"></div>}


          {/* Totales */}
          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs space-y-2 p-5 bg-gray-100 rounded-lg border border-gray-300 shadow-md">
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
              <div className="flex justify-between items-center pt-4 mt-4 font-bold text-xl text-gray-900 border-t-2 border-gray-400">
                <span>TOTAL:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página sutil */}
      <div className="bg-gray-800 h-8 w-full"></div>
    </div>
  );
}
