"use client";

import { EstiloPantonePDF } from "@/components/estilos-pdf/pantonePDF";
import { EstiloMinimalPDF } from "@/components/estilos-pdf/minimalPDF";
import { EstiloModernoPDF } from "@/components/estilos-pdf/modernoPDF";
import { EstiloClasicoPDF } from "@/components/estilos-pdf/clasicoPDF";

export function PresupuestoPDF({ formData, estilo }: { formData: any, estilo: string }) {
  switch (estilo) {
    case "pantone":
      return <EstiloPantonePDF formData={formData} />;
    case "minimal":
      return <EstiloMinimalPDF formData={formData} />;
    case "moderno":
      return <EstiloModernoPDF formData={formData} />;
    case "clasico":
      return <EstiloClasicoPDF formData={formData} />;
    default:
      return <EstiloModernoPDF formData={formData} />;
  }
}
