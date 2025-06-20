import React from 'react';

// Define las interfaces para asegurar el tipado de los datos
interface Concepto {
  cantidad: number;
  descripcion: string;
  precio: number; // Asumo que se llama 'precio' en los datos reales
  descuento: number; // Asumo que existe un campo de descuento
  importe: number; // Asumo que el importe final del concepto se calcula o está disponible
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

export function EstiloPantoneHTML({ formData }: { formData: FormData }) {
  // Calcula los totales basados en el formData
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: Concepto) => acc + c.cantidad * c.precio, // CAMBIO: Usar c.precio
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const emisor = formData.emisor || {};
  const cliente = formData.cliente || {};

  return (
    <div className="bg-white rounded-lg shadow-xl text-gray-800 text-sm font-sans overflow-hidden">
      {/* Encabezado con color Pantone principal y distribución cambiada */}
      <div className="bg-[#6B4E99] h-20 w-full flex items-center px-8 py-4 relative">
        <h1 className="text-white font-bold text-4xl tracking-wider z-10">FACTURA</h1>
        {/* Número de presupuesto en el encabezado para mayor visibilidad */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-lg font-semibold z-10">
          {formData.numeroPresupuesto || "N/A"}
        </div>
        {/* Elemento decorativo del encabezado */}
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[#5B8FF9] transform -skew-x-12 origin-bottom-right z-0"></div>
      </div>

      <div className="p-8 space-y-8">
        {/* Sección de Datos de Emisor y Cliente - Más prominente y separada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Datos del Emisor */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-semibold text-lg mb-3 text-[#6B4E99] border-b-2 border-[#6B4E99]/50 pb-2">Datos del Emisor</h2>
            <div className="space-y-1">
              <p><strong className="text-gray-700">Nombre:</strong> {emisor.nombre}</p>
              <p><strong className="text-gray-700">NIF:</strong> {emisor.nif}</p>
              <p><strong className="text-gray-700">Domicilio Fiscal:</strong> {emisor.direccion}</p>
              <p><strong className="text-gray-700">Código Postal:</strong> {emisor.cp}</p>
              <p><strong className="text-gray-700">Ciudad:</strong> {emisor.ciudad}</p>
              <p><strong className="text-gray-700">Provincia:</strong> {emisor.provincia}</p>
              <p><strong className="text-gray-700">País:</strong> {emisor.pais}</p>
              <p><strong className="text-gray-700">Teléfono:</strong> {emisor.telefono}</p>
              <p><strong className="text-gray-700">Email:</strong> {emisor.email}</p>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-semibold text-lg mb-3 text-[#6B4E99] border-b-2 border-[#6B4E99]/50 pb-2">Datos del Cliente</h2>
            <div className="space-y-1">
              <p><strong className="text-gray-700">Nombre:</strong> {cliente.nombre}</p>
              <p><strong className="text-gray-700">NIF:</strong> {cliente.nif}</p>
              <p><strong className="text-gray-700">Domicilio Fiscal:</strong> {cliente.direccion}</p>
              <p><strong className="text-gray-700">Código Postal:</strong> {cliente.cp}</p>
              <p><strong className="text-gray-700">Ciudad:</strong> {cliente.ciudad}</p>
              <p><strong className="text-gray-700">Provincia:</strong> {cliente.provincia}</p>
              <p><strong className="text-gray-700">País:</strong> {cliente.pais}</p>
              <p><strong className="text-gray-700">Teléfono:</strong> {cliente.telefono}</p>
              <p><strong className="text-gray-700">Email:</strong> {cliente.email}</p>
            </div>
          </div>
        </div>

        {/* Sección de Datos del Documento - Estilo de tarjeta con info clave */}
        <div className="bg-[#E0E2EC] p-6 rounded-lg shadow-inner text-gray-700 font-medium flex flex-col items-end">
          <h2 className="font-semibold text-lg mb-4 text-[#6B4E99] w-full text-right border-b-2 border-[#6B4E99]/50 pb-2">Detalles del Presupuesto</h2>
          <div className="space-y-2 text-right">
            <p><strong>Fecha de emisión:</strong> {formData.fechaEmision || "N/A"}</p>
            <p><strong>Fecha de vencimiento:</strong> {formData.fechaVencimiento || "N/A"}</p>
          </div>
        </div>

        {/* Tabla de Conceptos */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#6B4E99] text-white text-left">
                <th className="p-4 rounded-tl-lg">Descripción</th>
                <th className="text-right p-4">Cantidad</th>
                <th className="text-right p-4">Precio Unitario</th>
                <th className="text-right p-4 rounded-tr-lg">Importe</th>
              </tr>
            </thead>
            <tbody>
              {formData.conceptos.map((c: Concepto, i: number) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3">{c.descripcion}</td>
                  <td className="p-3 text-right">{c.cantidad}</td>
                  <td className="p-3 text-right">{c.precio.toFixed(2)}€</td>
                  <td className="p-3 text-right">
                    {(c.cantidad * c.precio).toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección de Notas y Totales - Distribución en columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Sección de Notas */}
          {formData.observaciones && (
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
              <h3 className="font-semibold mb-2 text-[#6B4E99] border-b-2 border-[#6B4E99]/50 pb-2">Notas / Forma de pago:</h3>
              <p className="text-gray-600 leading-relaxed">{formData.observaciones}</p>
            </div>
          )}
          {/* Si no hay notas, el div de totales ocupa todo el ancho en mobile, o la columna en desktop */}
          {!formData.observaciones && <div className="md:col-span-1"></div>}


          {/* Sección de Totales - Tarjeta de resumen */}
          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs bg-[#F5EEFF] p-6 rounded-lg border border-gray-300 shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Base imponible:</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">IVA ({formData.iva || 0}%):</span>
                  <span>{iva.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Retención IRPF ({formData.irpf || 0}%):</span>
                  <span>-{irpf.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 font-bold text-xl text-[#4A2D73] border-t border-gray-300">
                  <span>TOTAL:</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de página con acento azul */}
      <div className="bg-[#5B8FF9] h-10 w-full"></div>
    </div>
  );
}
