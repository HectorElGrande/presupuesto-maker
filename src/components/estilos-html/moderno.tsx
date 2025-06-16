// src/components/estilos-html/Moderno.tsx

export function EstiloModernoHTML({ formData }: { formData: any }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.cantidad * c.precio,
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  return (
    <div className="bg-white rounded-md shadow p-6 border text-black">
      <div className="bg-neutral-800 h-4 w-full rounded mb-6">
      </div>

      <div className="mb-4 text-sm space-y-1">
        <p><strong>Profesional:</strong> {formData.profesional?.nombre || ""}</p>
        <p><strong>Cliente:</strong> {formData.nombreCliente || ""}</p>
        <p><strong>Número:</strong> {formData.numeroPresupuesto || ""}</p>
        <p><strong>Fecha:</strong> {formData.fechaEmision || ""}</p>
      </div>

      <table className="w-full text-sm border border-gray-300 mb-4">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border text-right">Cantidad</th>
            <th className="p-2 border text-right">Precio</th>
            <th className="p-2 border text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {formData.conceptos.map((c: any, i: number) => (
            <tr key={i}>
              <td className="p-2 border">{c.descripcion}</td>
              <td className="p-2 border text-right">{c.cantidad}</td>
              <td className="p-2 border text-right">{c.precio.toFixed(2)}€</td>
              <td className="p-2 border text-right">
                {(c.cantidad * c.precio).toFixed(2)}€
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-sm space-y-1">
        <p>Base imponible: {subtotal.toFixed(2)}€</p>
        <p>IVA {formData.iva || 0}%: {iva.toFixed(2)}€</p>
        <p>Retención IRPF {formData.irpf || 0}%: -{irpf.toFixed(2)}€</p>
        <p className="font-bold text-lg">Total: {total.toFixed(2)}€</p>
      </div>

      {formData.observaciones && (
        <div className="mt-4 text-sm">
          <strong>Notas:</strong> {formData.observaciones}
        </div>
      )}
    </div>
  );
}
