"use client";

import { EstiloPantoneHTML } from "@/components/estilos-html/pantone";
import { EstiloMinimalHTML } from "@/components/estilos-html/minimal";
import { EstiloModernoHTML } from "@/components/estilos-html/moderno";
import { EstiloClasicoHTML } from "@/components/estilos-html/clasico";
import React, { useState } from "react"; // <--- Línea corregida aquí
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
    pantone: EstiloPantoneHTML,
    minimal: EstiloMinimalHTML,
    clasico: EstiloClasicoHTML,
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

  // Se elimina la lógica de `previewWidths` para usar un ancho máximo fijo.
  // Define un ancho máximo constante para todas las previsualizaciones.
  const fixedMaxWidth = "max-w-4xl"; // Puedes ajustar este valor (ej: "max-w-3xl", "max-w-2xl")

  return (
    // Contenedor principal con ancho máximo y centrado
    <div className="mx-auto flex flex-col items-center p-4">
      {/* Contenedor de la previsualización con ancho máximo fijo para todos los estilos */}
      <div className={`w-full ${fixedMaxWidth} border border-gray-200 rounded-lg shadow-md overflow-hidden`}>
        {React.createElement(componenteVista, { formData, setFormData })}
      </div>

      {/* Contenedor de botones también con el mismo ancho máximo fijo para alineación */}
      <div className={`flex justify-between items-center mt-6 flex-wrap gap-4 w-full ${fixedMaxWidth}`}>
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
