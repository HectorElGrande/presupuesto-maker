"use client";

import { PantonePDF } from "@/components/estilos-pdf/pantonePDF";
import { MinimalPDF } from "@/components/estilos-pdf/minimalPDF";
import { EstiloModernoPDF } from "@/components/estilos-pdf/modernoPDF";
import { ClasicoPDF } from "@/components/estilos-pdf/clasicoPDF";

export function PresupuestoPDF({ formData, estilo }: { formData: any, estilo: string }) {
  switch (estilo) {
    case "pantone":
      return <PantonePDF formData={formData} />;
    case "minimal":
      return <MinimalPDF formData={formData} />;
    case "moderno":
      return <EstiloModernoPDF formData={formData} />;
    case "clasico":
      return <ClasicoPDF formData={formData} />;
    default:
      return <EstiloModernoPDF formData={formData} />;
  }
}
