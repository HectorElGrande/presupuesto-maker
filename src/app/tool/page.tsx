'use client';

import { useState } from 'react';
import { FormularioPresupuesto } from '@/components/formulario-presupuesto';
import { VistaPrevia } from "@/components/vista-previa";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useIsMobile } from '@/components/is-mobile-width';

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
    <main className="min-h-screen text-foreground">
      {isMobile ? (
        <div className="flex flex-col gap-6">
          <div className='p-20'>
            <FormularioPresupuesto formData={formData} setFormData={setFormData} />
          </div>
          <div className='p-20'>
            <VistaPrevia formData={formData} setFormData={setFormData} />
          </div>
        </div>
      ) : (
        <PanelGroup direction="horizontal" className='p-10 px-20'>
          <Panel defaultSize={50} minSize={30} className='p-10'>
            <FormularioPresupuesto formData={formData} setFormData={setFormData} />
          </Panel>
          <PanelResizeHandle className="w-5 relative group cursor-col-resize" />
          <Panel defaultSize={50} minSize={30} className='min-h-screen p-20'>
            <VistaPrevia formData={formData} setFormData={setFormData} />
          </Panel>
        </PanelGroup >
      )}
    </main>
  );
}
