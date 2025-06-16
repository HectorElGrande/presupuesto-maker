"use client";

import { useState, useEffect } from "react";
import { SubidaLogo } from "@/components/subida-logo";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, Eye, EyeOff, Brush, Download } from "lucide-react";

const estilos = [
  { id: "moderno", nombre: "Moderno", preview: "/estilos/modern.svg" },
  { id: "pantone", nombre: "Pantone", preview: "/estilos/pantone.svg" },
  { id: "clasico", nombre: "Clásico", preview: "/estilos/clasic.svg" },
  { id: "minimal", nombre: "Minimal", preview: "/estilos/minimal.svg" },
  { id: "clasico1", nombre: "Clásico", preview: "/estilos/clasic.svg" },
];

const tamanosLogo = ["S", "M", "L", "XL"];

export function PersonalizadorEstilo({
  estiloActual,
  setEstilo,
  formData,
  setFormData,
  estiloOriginal,
  setEstiloOriginal,
}: {
  estiloActual: string;
  setEstilo: (estilo: string) => void;
  formData: any;
  setFormData: (formData: any) => void;
  estiloOriginal: string;
  setEstiloOriginal: (estilo: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [estiloSeleccionado, setEstiloSeleccionado] = useState(estiloActual);
  const [mostrarLogo, setMostrarLogo] = useState(formData.mostrarLogo ?? true);
  const [tamanoLogo, setTamanoLogo] = useState(formData.tamanoLogo ?? "S");
  const [logoTemporal, setLogoTemporal] = useState(formData.logo ?? "");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (open) {
      // Al abrir el modal: guardar estado original y resetear bandera de guardado
      setEstiloOriginal(formData.estilo);
      setEstiloSeleccionado(formData.estilo);
      setMostrarLogo(formData.mostrarLogo ?? true);
      setTamanoLogo(formData.tamanoLogo ?? "S");
      setLogoTemporal(formData.logo ?? "");
      setGuardado(false);
    } else if (!guardado) {
      // Al cerrar sin guardar: revertir
      setFormData((prev: any) => ({ ...prev, estilo: estiloOriginal }));
      setEstilo(estiloOriginal);
    }
  }, [open]);

  const handleSeleccionEstilo = (nuevoEstilo: string) => {
    setEstiloSeleccionado(nuevoEstilo);
    setFormData((prev: any) => ({ ...prev, estilo: nuevoEstilo }));
    setEstilo(nuevoEstilo);
  };

  const handleGuardar = () => {
    setFormData((prev: any) => ({
      ...prev,
      estilo: estiloSeleccionado,
      mostrarLogo,
      tamanoLogo,
      logo: logoTemporal,
    }));
    setEstilo(estiloSeleccionado);
    setGuardado(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow cursor-pointer">
           <Brush className="w-6 h-6" />Personalizar estilo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-6">
        <DialogTitle className="text-2xl font-semibold mb-6">
          Personalizar estilo
        </DialogTitle>

        {/* Estilos */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {estilos.map((estilo) => (
            <button
              key={estilo.id}
              onClick={() => handleSeleccionEstilo(estilo.id)}
              className={cn(
                "rounded border hover:border-primary p-2 transition-all cursor-pointer",
                estiloSeleccionado === estilo.id &&
                  "border-2 border-primary shadow-sm"
              )}
            >
              <img
                src={estilo.preview}
                alt={estilo.nombre}
                className="mb-2 rounded"
              />
              <p className="text-sm text-center">{estilo.nombre}</p>
            </button>
          ))}
        </div>

        {/* Subida logo */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Logotipo</p>
            <div className="border-dashed border border-muted rounded px-4 py-3 text-sm text-muted-foreground flex items-center justify-between">
              <SubidaLogo
                setLogo={(logo) => setLogoTemporal(logo)}
              />
              <Upload className="w-4 h-4 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tamaño máximo aceptado: 500px de ancho y alto, 2MB. Formatos: PNG o JPG.
            </p>
          </div>

          {/* Controles de logo */}
          <div className="flex items-center justify-between mt-4">
            {/* Visibilidad */}
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="icon"
              onClick={() => setMostrarLogo(!mostrarLogo)}
              title={mostrarLogo ? "Ocultar logo" : "Mostrar logo"}
            >
              {mostrarLogo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>

            {/* Tamaño */}
            <div className="flex gap-2">
              {tamanosLogo.map((size) => (
                <Button
                  className="cursor-pointer"
                  key={size}
                  variant={size === tamanoLogo ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTamanoLogo(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Guardar */}
        <div className="text-right mt-6">
          <Button onClick={handleGuardar} className="shadow-md px-6 cursor-pointer">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
