"use client";

export function VistaClasica({ formData }: any) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.precio * c.cantidad,
    0
  ).toFixed(2);

  return (
    <div className="w-full bg-white shadow-md border border-gray-300 rounded px-8 py-6 text-sm text-black leading-relaxed">
      
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-1">Presupuesto</h2>
        <hr className="border-t border-gray-400 mb-4" />

        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium">{formData.profesional.nombre}</p>
            {formData.profesional.email && <p>{formData.profesional.email}</p>}
            {formData.profesional.telefono && <p>{formData.profesional.telefono}</p>}
          </div>
          <div className="text-right">
            <p><span className="font-medium">Cliente:</span> {formData.nombreCliente || "Nombre del cliente"}</p>
            <p><span className="font-medium">Fecha:</span> {formData.fecha || new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Tabla de conceptos con alternancia de grises */}
      <div className="mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-gray-400 text-left bg-gray-100">
              <th className="py-2 px-2">Descripción</th>
              <th className="py-2 px-2 text-center">Cantidad</th>
              <th className="py-2 px-2 text-right">Precio</th>
              <th className="py-2 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.conceptos.map((concepto: any, idx: number) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-2">{concepto.descripcion}</td>
                <td className="py-2 px-2 text-center">{concepto.cantidad}</td>
                <td className="py-2 px-2 text-right">{concepto.precio.toFixed(2)} €</td>
                <td className="py-2 px-2 text-right font-medium">
                  {(concepto.precio * concepto.cantidad).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observaciones */}
      {formData.observaciones && (
        <div className="mb-6 text-sm whitespace-pre-line text-gray-700">
          <hr className="border-t border-gray-300 mb-2" />
          <p><span className="font-medium">Notas:</span> {formData.observaciones}</p>
        </div>
      )}

      {/* Totales */}
      <div className="flex justify-end mt-2">
        <div className="text-right">
          <p className="text-sm mb-1">Subtotal:</p>
          <p className="text-lg font-semibold">{subtotal} €</p>
        </div>
      </div>
    </div>
  );
}
