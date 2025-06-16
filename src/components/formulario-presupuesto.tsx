"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TablaConceptos from "@/components/tabla-conceptos";
import { SelectorEntidad } from "@/components/slector-datos-fiscales";
import { Button } from "./ui/button";

export function FormularioPresupuesto({ formData, setFormData }: any) {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-semibold">Genera presupuestos personalizados</h2>
      <p className="text-muted-foreground">
        Completa los campos para generar y descargar presupuestos legales.
      </p>

      {/* Selector de Emisor y Cliente */}
      <div className="grid grid-cols-2 gap-4">
        <SelectorEntidad
          tipo="emisor"
          datos={formData.emisor}
          setDatos={(nuevo: any) => handleChange("emisor", nuevo)}
        />
        <SelectorEntidad
          tipo="cliente"
          datos={formData.cliente}
          setDatos={(nuevo: any) => handleChange("cliente", nuevo)}
        />
      </div>

      {/* Datos del documento */}
      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Fecha de emisión</Label>
          <Input
            type="date"
            value={formData.fechaEmision || ""}
            onChange={(e) => handleChange("fechaEmision", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha de vencimiento</Label>
          <Input
            type="date"
            value={formData.fechaVencimiento || ""}
            onChange={(e) => handleChange("fechaVencimiento", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Número de factura</Label>
          <Input
            placeholder="Num. documento"
            value={formData.numeroPresupuesto || ""}
            onChange={(e) => handleChange("numeroPresupuesto", e.target.value)}
          />
        </div>
      </div>

      <TablaConceptos formData={formData} setFormData={setFormData} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>IVA</Label>
          <Select
            onValueChange={(value) => handleChange("iva", parseFloat(value))}
            value={formData.iva?.toString() || ""}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Selecciona IVA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="21">21%</SelectItem>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="0">Exento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>IRPF</Label>
          <Select
            onValueChange={(value) => handleChange("irpf", parseFloat(value))}
            value={formData.irpf?.toString() || ""}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Selecciona IRPF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="7">7%</SelectItem>
              <SelectItem value="15">15%</SelectItem>
              <SelectItem value="19">19%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notas y forma de pago</Label>
        <Textarea
          value={formData.observaciones || ""}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          placeholder="Ej: Pago mediante transferencia en 15 días. IBAN: ES00 0000 0000 0000"
        />
      </div>
    </div>
  );
}
