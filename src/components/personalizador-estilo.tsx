"use client";

import { useState } from "react";
import { SubidaLogo } from "@/components/subida-logo";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, Eye, EyeOff } from "lucide-react";

const estilos = [
  { id: "moderno", nombre: "Moderno", preview: "/estilos/modern.svg" },
  { id: "pantone", nombre: "Pantone", preview: "/estilos/pantone.svg" },
  { id: "clasico", nombre: "Clásico", preview: "/estilos/clasic.svg" },
  { id: "minimal", nombre: "Minimal", preview: "/estilos/minimal.svg" },
  { id: "minimal", nombre: "Minimal", preview: "/estilos/minimal.svg" },
];

const tamanosLogo = ["S", "M", "L", "XL"];

export function PersonalizadorEstilo({
  estiloActual,
  setEstilo,
}: {
  estiloActual: string;
  setEstilo: (estilo: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mostrarLogo, setMostrarLogo] = useState(true);
  const [tamanoLogo, setTamanoLogo] = useState("S");
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow">🎨 Personalizar estilo</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-6">
        <DialogTitle className="text-2xl font-semibold mb-6">
          Personalizar estilo
        </DialogTitle>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {estilos.map((estilo) => (
            <button
              key={estilo.id}
              onClick={() => setEstilo(estilo.id)}
              className={cn(
                "rounded border hover:border-primary p-2 transition-all",
                estiloActual === estilo.id && "border-2 border-primary shadow-sm"
              )}
            >
              <img src={estilo.preview} alt={estilo.nombre} className="mb-2 rounded" />
              <p className="text-sm text-center">{estilo.nombre}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Subida de logo */}
          <div>
            <p className="text-sm font-medium mb-1">Logotipo</p>
            <div className="border-dashed border border-muted rounded px-4 py-3 text-sm text-muted-foreground flex items-center justify-between">
              <SubidaLogo setLogo={(logo) =>
                          setFormData((prev: any) => ({ ...prev, logo }))
                        } />
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
              variant="ghost"
              size="icon"
              onClick={() => setMostrarLogo(!mostrarLogo)}
              title={mostrarLogo ? "Ocultar logo" : "Mostrar logo"}
            >
              {mostrarLogo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>

            {/* Tamaños */}
            <div className="flex gap-2">
              {tamanosLogo.map((size) => (
                <Button
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

        {/* Botón Guardar */}
        <div className="text-right mt-6">
          <Button onClick={() => setOpen(false)} className="shadow-md px-6">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
