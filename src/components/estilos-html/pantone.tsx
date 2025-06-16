"use client";

export function VistaPantone({ formData }: any) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.precio * c.cantidad,
    0
  ).toFixed(2);

  const tonosGris = ["#F3F3F3", "#E7E7E7"];

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden text-sm text-black font-sans">
      {/* Cabecera púrpura */}
      <div className="bg-purple-700 text-white px-6 py-4">
        <h1 className="text-xl font-bold">Presupuesto</h1>
        <p className="text-sm opacity-90">
          {formData.fechaEmision || new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Info cliente y empresa */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-neutral-200 bg-gray-50">
        <div>
          <h3 className="text-gray-700 font-semibold mb-1">Cliente</h3>
          <p>{formData.nombreCliente || 'Nombre del cliente'}</p>
        </div>
        <div className="text-right">
          <h3 className="text-gray-700 font-semibold mb-1">Profesional</h3>
          <p>{formData.profesional.nombre}</p>
          <p className="text-sm text-gray-500">{formData.profesional.email}</p>
          <p className="text-sm text-gray-500">{formData.profesional.telefono}</p>
        </div>
      </div>

      {/* Tabla de conceptos */}
      <div className="py-4 px-6 pt-4">
        <table className="w-full text-left border-separate">
          <thead>
            <tr className="text-gray-700 text-sm">
              <th>Descripción</th>
              <th className="text-center">Cantidad</th>
              <th className="text-right">Precio</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.conceptos.map((item: any, idx: number) => (
              <tr
                key={idx}
                style={{ backgroundColor: tonosGris[idx % 2] }}
                className="rounded"
              >
                <td className="px-2 rounded-l">{item.descripcion}</td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-right">{item.precio} €</td>
                <td className="text-right rounded-r px-2">
                  {(item.precio * item.cantidad).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observaciones */}
      {formData.observaciones && (
        <div className="px-6 py-4 bg-[#F5F0F9] border-t">
          <h4 className="font-semibold text-gray-700 mb-1">Notas</h4>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {formData.observaciones}
          </p>
        </div>
      )}

      {/* Total en recuadro azul */}
      <div className="px-6 py-6 bg-white border-t flex justify-end">
        <div className="bg-blue-500 text-white text-lg font-semibold rounded-md px-6 py-3 shadow-sm">
          Total: {subtotal} €
        </div>
      </div>
    </div>
  );
}
