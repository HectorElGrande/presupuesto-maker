// ✅ src/components/vista-previa-html.tsx
"use client";

import { VistaPantone } from "@/components/estilos-html/pantone";
import { VistaMinimal } from "@/components/estilos-html/minimal";
import { EstiloModernoHTML } from "@/components/estilos-html/moderno";
import React from "react";
import { PersonalizadorEstilo } from "./personalizador-estilo";
import { Button } from "./ui/button";
import { PresupuestoPDF } from "./pdf-generated";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";


export function VistaPrevia({ formData, setFormData }: any) {
  const componenteVista = {
    moderno: EstiloModernoHTML,
    pantone: VistaPantone,
    minimal: VistaMinimal,
  }[formData.estilo] || EstiloModernoHTML;

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

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Button onClick={handleDownload}>Descargar PDF</Button>

        <PersonalizadorEstilo
          estiloActual={formData.estilo}
          setEstilo={(nuevo: string) => setFormData({ ...formData, estilo: nuevo })}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      {React.createElement(componenteVista, { formData, setFormData })}
    </div>
  );

}
