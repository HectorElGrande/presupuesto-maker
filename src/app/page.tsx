'use client';

import { useState } from 'react';
import { FormularioPresupuesto } from '@/components/formulario-presupuesto';
import { VistaPrevia } from "@/components/vista-previa";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useIsMobile } from '@/components/is-mobile-width'; // donde lo pongas
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function Home() {
  const isMobile = useIsMobile(); // < 1024px

  const [formData, setFormData] = useState({
    numeroPresupuesto: '',
    fechaEmision: '',
    fechaVencimiento: '',
    emisor: { nombre: '', nif: '', direccion: '', codigoPostal: '', ciudad: '', provincia: '', pais: '', telefono: '', email: '' },
    cliente: { nombre: '', nif: '', direccion: '', codigoPostal: '', ciudad: '', provincia: '', pais: '', telefono: '', email: '' },
    conceptos: [{ descripcion: '', cantidad: 0, precio: 0 }],
    iva: 21,
    irpf: 7,
    observaciones: '',
    estilo: 'moderno',
    logo: '',
    mostrarLogo: true,
    tamanoLogo: 'S',
  });

  return (
    <main className="min-h-screen bg-muted text-foreground p-4 md:p-10">
      {isMobile ? (
        <div className="flex flex-col gap-6">
          <FormularioPresupuesto formData={formData} setFormData={setFormData} />
          <VistaPrevia formData={formData} setFormData={setFormData} />
        </div>
      ) : (
        <ResizablePanelGroup  direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={20}>
            <FormularioPresupuesto formData={formData} setFormData={setFormData} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <VistaPrevia formData={formData} setFormData={setFormData} />
          </ResizablePanel>
        </ResizablePanelGroup >
      )}
    </main>
  );
}
