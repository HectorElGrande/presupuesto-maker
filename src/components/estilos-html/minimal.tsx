export function VistaMinimal({ formData }: any) {
  return (
    <div className="bg-white text-black p-6 rounded-md shadow-sm border mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Presupuesto</h2>
      </div>

      {/* Datos del profesional */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Profesional</h3>
        <p className="text-sm">{formData.profesional.nombre}</p>
        <p className="text-sm">{formData.profesional.telefono}</p>
        <p className="text-sm">{formData.profesional.email}</p>
      </div>

      {/* Cliente */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Cliente</h3>
        <p className="text-sm">{formData.nombreCliente}</p>
      </div>

      {/* Conceptos */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Detalle del presupuesto</h3>
        <table className="w-full border-t border-b border-gray-300 text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Descripción</th>
              <th className="py-2 text-right">Cantidad</th>
              <th className="py-2 text-right">Precio</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.conceptos.map((concepto: any, index: number) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-2">{concepto.descripcion}</td>
                <td className="py-2 text-right">{concepto.cantidad}</td>
                <td className="py-2 text-right">{concepto.precio.toFixed(2)} €</td>
                <td className="py-2 text-right">
                  {(concepto.cantidad * concepto.precio).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observaciones */}
      {formData.observaciones && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Observaciones</h3>
          <p className="text-sm whitespace-pre-line">{formData.observaciones}</p>
        </div>
      )}

      {/* Total */}
      <div className="text-right border-t pt-4 mt-4 text-sm font-semibold">
        Total:{" "}
        {formData.conceptos
          .reduce((acc: number, c: any) => acc + c.cantidad * c.precio, 0)
          .toFixed(2)}{" "}
        €
      </div>
    </div>
  );
}
