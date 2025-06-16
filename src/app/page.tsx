'use client';

import { useState } from 'react';
import { FormularioPresupuesto } from '@/components/formulario-presupuesto';
import { VistaPrevia } from "@/components/vista-previa";
import { GripVertical } from "lucide-react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

export default function Home() {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    conceptos: [{ descripcion: '', cantidad: 1, precio: 0 }],
    observaciones: '',
    profesional: {
      nombre: 'Tu nombre o empresa',
      telefono: '',
      email: '',
    },
    estilo: 'moderno',
    logo: '',
  });

  return (
    <main className="min-h-screen bg-muted text-foreground p-20">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={20}>
          <div className="w-full">
            <FormularioPresupuesto formData={formData} setFormData={setFormData} />
          </div>
        </Panel>
        <PanelResizeHandle
          className="w-5 relative group cursor-col-resize transition-colors hover:bg-muted/40"
        >
        </PanelResizeHandle>
        <Panel defaultSize={30} minSize={20}>
          <div className="w-full">
            <VistaPrevia formData={formData} setFormData={setFormData} />
          </div>
        </Panel>
      </PanelGroup>
    </main>
  );
}
