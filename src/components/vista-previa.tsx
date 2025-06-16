// ✅ src/components/vista-previa-html.tsx
"use client";

import { VistaPantone } from "@/components/estilos-html/pantone";
import { VistaMinimal } from "@/components/estilos-html/minimal";
import { EstiloModernoHTML } from "@/components/estilos-html/moderno";
import { VistaClasica } from "@/components/estilos-html/clasico";
import React, { useState } from "react";
import { PersonalizadorEstilo } from "./personalizador-estilo";
import { Button } from "./ui/button";
import { PresupuestoPDF } from "./pdf-generated";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";


export function VistaPrevia({ formData, setFormData }: any) {
  const [estiloOriginal, setEstiloOriginal] = useState(formData.estilo);
  const componenteVista = {
    moderno: EstiloModernoHTML,
    pantone: VistaPantone,
    minimal: VistaMinimal,
    clasico: VistaClasica,
  }[formData.estilo] || EstiloModernoHTML;

  const handleDownload = async () => {
    const blob = await pdf(
      <PresupuestoPDF
        formData={formData}
        estilo={formData.estilo}
      />
    ).toBlob();
    saveAs(blob, "presupuesto.pdf");
  };

  return (
    <div className="mx-auto">
      {React.createElement(componenteVista, { formData, setFormData })}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        <Button className="cursor-pointer" onClick={handleDownload}><Download className="w-6 h-6" />Descargar PDF</Button>

        <PersonalizadorEstilo
          estiloActual={formData.estilo}
          setEstilo={(estilo) =>
            setFormData((prev: any) => ({ ...prev, estilo }))
          }
          formData={formData}
          setFormData={setFormData}
          estiloOriginal={estiloOriginal}
          setEstiloOriginal={setEstiloOriginal}
        />
      </div>
    </div>
  );

}
