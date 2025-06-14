// ✅ src/components/vista-previa-html.tsx
"use client";

import { Button } from "@/components/ui/button";
import { PersonalizadorEstilo } from "@/components/personalizador-estilo";
import { PresupuestoPDF } from "@/components/pdf-generated";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { cn } from "@/lib/utils";

export function VistaPrevia({ formData, setFormData }: {
  formData: any;
  setFormData: (formData: any) => void;
}) {
  const subtotal = formData.conceptos.reduce(
    (acc: number, c: any) => acc + c.cantidad * c.precio,
    0
  );
  const iva = formData.iva ? (subtotal * formData.iva) / 100 : 0;
  const irpf = formData.irpf ? (subtotal * formData.irpf) / 100 : 0;
  const total = subtotal + iva - irpf;

  const handleDownload = async () => {
    const blob = await pdf(
      <PresupuestoPDF
        formData={formData}
        estilo={formData.estilo}
        logo={formData.logo}
      />
    ).toBlob();
    saveAs(blob, "presupuesto.pdf");
  };

  const setEstilo = (estilo: string) => {
    setFormData({ ...formData, estilo });
  };

  return (
    <div
      className={cn(
        "rounded-md border p-4 shadow space-y-6 transition-all duration-300",
        formData.estilo === "pantone" && "bg-blue-50 text-blue-900",
        formData.estilo === "moderno" && "bg-white text-black",
        formData.estilo === "clasico" && "bg-yellow-50 text-yellow-900",
        formData.estilo === "minimal" && "bg-gray-100 text-gray-800"
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Vista previa del presupuesto</h2>
        <PersonalizadorEstilo estiloActual={formData.estilo} setEstilo={setEstilo} />
      </div>

      {formData.logo && (
        <div className="flex justify-center mb-4">
          <img
            src={formData.logo}
            alt="Logotipo"
            className="h-20 max-w-xs object-contain mx-auto rounded shadow-md border border-gray-200"
          />
        </div>
      )}

      <div className="text-sm space-y-2">
        <p>
          <strong>Profesional:</strong> {formData.profesional?.nombre || "Nombre del profesional"}
        </p>
        <p>
          <strong>Cliente:</strong> {formData.nombreCliente || "Nombre del cliente"}
        </p>
        <p>
          <strong>Número:</strong> {formData.numeroPresupuesto || "F250001"}
        </p>
        <p>
          <strong>Fecha:</strong> {formData.fechaEmision || "dd/mm/yyyy"}
        </p>

        <table className="w-full text-sm border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 border">Descripción</th>
              <th className="text-right p-2 border">Cantidad</th>
              <th className="text-right p-2 border">Precio</th>
              <th className="text-right p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {formData.conceptos.map((c: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{c.descripcion}</td>
                <td className="text-right p-2 border">{c.cantidad}</td>
                <td className="text-right p-2 border">{c.precio.toFixed(2)}€</td>
                <td className="text-right p-2 border">
                  {(c.cantidad * c.precio).toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-1 mt-2">
          <p>Base imponible: {subtotal.toFixed(2)}€</p>
          <p>IVA {formData.iva || 0}%: {iva.toFixed(2)}€</p>
          <p>Retención IRPF {formData.irpf || 0}%: -{irpf.toFixed(2)}€</p>
          <p className="font-bold">Total: {total.toFixed(2)}€</p>
        </div>

        <p className="mt-2">
          <strong>Notas:</strong> {formData.observaciones || "Sin observaciones."}
        </p>
      </div>

      <div className="text-center pt-4">
        <Button onClick={handleDownload}>Descargar PDF</Button>
      </div>
    </div>
  );
}
