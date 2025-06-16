export function EstiloModernoHTML({ formData }: { formData: any }) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.cantidad * c.precio,
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const emisor = formData.emisor || {};
  const cliente = formData.cliente || {};

  return (
    <div className="bg-white rounded-md shadow text-black text-sm font-sans">
      <div className="bg-neutral-600 h-14 w-full rounded-t flex items-center justify-center">
        <h1 className="text-white font-bold text-2xl tracking-wide">Factura</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <h2 className="font-semibold text-base mb-1">Datos del Emisor</h2>
            <p><strong>Nombre:</strong> {emisor.nombre}</p>
            <p><strong>NIF:</strong> {emisor.nif}</p>
            <p><strong>Domicilio Fiscal:</strong> {emisor.direccion}</p>
            <p><strong>Código Postal:</strong> {emisor.cp}</p>
            <p><strong>Ciudad:</strong> {emisor.ciudad}</p>
            <p><strong>Provincia:</strong> {emisor.provincia}</p>
            <p><strong>País:</strong> {emisor.pais}</p>
            <p><strong>Teléfono:</strong> {emisor.telefono}</p>
            <p><strong>Email:</strong> {emisor.email}</p>
          </div>

          <div className="space-y-1 text-right">
            <h2 className="font-semibold text-base mb-1">Datos del Cliente</h2>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>NIF:</strong> {cliente.nif}</p>
            <p><strong>Domicilio Fiscal:</strong> {cliente.direccion}</p>
            <p><strong>Código Postal:</strong> {cliente.cp}</p>
            <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
            <p><strong>Provincia:</strong> {cliente.provincia}</p>
            <p><strong>País:</strong> {cliente.pais}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <p><strong>Número:</strong> {formData.numeroPresupuesto || ""}</p>
          <p><strong>Fecha de emisión:</strong> {formData.fechaEmision || ""}</p>
          <p><strong>Fecha de vencimiento:</strong> {formData.fechaVencimiento || ""}</p>
        </div>

        <div className="max-h-50 overflow-y-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Descripción</th>
                <th className="text-right p-2 border">Cantidad</th>
                <th className="text-right p-2 border">Precio</th>
                <th className="text-right p-2 border">Total</th>
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
        </div>

        <div className="text-right space-y-1 mt-4">
          <p><strong>Base imponible:</strong> {subtotal.toFixed(2)}€</p>
          <p><strong>IVA ({formData.iva || 0}%):</strong> {iva.toFixed(2)}€</p>
          <p><strong>Retención IRPF ({formData.irpf || 0}%):</strong> -{irpf.toFixed(2)}€</p>
          <p className="font-bold text-lg"><strong>Total:</strong> {total.toFixed(2)}€</p>
        </div>

        {formData.observaciones && (
          <div className="pt-4 text-sm">
            <p className="font-semibold">Notas / Forma de pago:</p>
            <p>{formData.observaciones}</p>
          </div>
        )}
      </div>
    </div>
  );
}
