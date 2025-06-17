"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { ModalDatosFiscales } from "@/components/modal-datos-fiscales";
import { useState } from "react";

interface SelectorEntidadProps {
  tipo: "emisor" | "cliente";
  datos: any;
  setDatos: (nuevo: any) => void;
}

export function SelectorEntidad({ tipo, datos, setDatos }: SelectorEntidadProps) {
  const [abierto, setAbierto] = useState(false);
  const tieneDatos = datos?.nombre?.trim();

  return (
    <div className="space-y-2">
      <Label>{tipo === "emisor" ? "Emisor" : "Cliente"}</Label>

      <div className="relative">
        {/* Este input actúa como trigger */}
        <div
          className="cursor-pointer"
          onClick={() => setAbierto(true)}
        >
          <Input
            readOnly
            value={tieneDatos ? datos.nombre : ""}
            placeholder={tipo === "emisor" ? "Emisor" : "Cliente"}
            className="pr-16"
          />
        </div>

        {/* Botón editar o añadir */}
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm flex items-center cursor-pointer"
        >
          {tieneDatos ? (
            <>
              Editar <Pencil className="w-4 h-4 ml-1" />
            </>
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Modal reutilizable */}
      <ModalDatosFiscales
        tipo={tipo}
        datos={datos}
        setDatos={setDatos}
        abierto={abierto}
        setAbierto={setAbierto}
      />
    </div>
  );
}
