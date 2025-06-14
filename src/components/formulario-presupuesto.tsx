"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import TablaConceptos from "@/components/tabla-conceptos";
import { SubidaLogo } from "@/components/subida-logo";

export function FormularioPresupuesto({ formData, setFormData }: any) {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Genera presupuestos personalizados</h2>
        
      </div>

      <p className="text-muted-foreground">
        Completa los campos para generar y descargar presupuestos personalizados.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Profesional</Label>
          <Input
            value={formData.profesional.nombre}
            onChange={(e) =>
              handleChange("profesional", {
                ...formData.profesional,
                nombre: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Cliente</Label>
          <Input
            value={formData.nombreCliente}
            onChange={(e) => handleChange("nombreCliente", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Número de documento</Label>
          <Input
            placeholder="F250001"
            value={formData.numeroPresupuesto || ""}
            onChange={(e) => handleChange("numeroPresupuesto", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha de emisión</Label>
          <Input
            type="date"
            value={formData.fechaEmision || ""}
            onChange={(e) => handleChange("fechaEmision", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Icono de empresa</Label>
          <SubidaLogo setLogo={(logo) =>
            setFormData((prev: any) => ({ ...prev, logo }))
          } />
        </div>
      </div>

      {/* ✅ Tabla de conceptos con reordenación y eliminación */}
      <TablaConceptos formData={formData} setFormData={setFormData} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Impuestos</Label>
          <Select
            onValueChange={(value) => handleChange("iva", parseFloat(value))}
            value={formData.iva?.toString() || ""}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Selecciona IVA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="21">IVA 21%</SelectItem>
              <SelectItem className="cursor-pointer" value="10">IVA 10%</SelectItem>
              <SelectItem className="cursor-pointer" value="0">Sin IVA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Retención IRPF</Label>
          <Select
            onValueChange={(value) => handleChange("irpf", parseFloat(value))}
            value={formData.irpf?.toString() || ""}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Selecciona IRPF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="0">Sin retención</SelectItem>
              <SelectItem className="cursor-pointer" value="7">Retención 7%</SelectItem>
              <SelectItem className="cursor-pointer" value="15">Retención 15%</SelectItem>
              <SelectItem className="cursor-pointer" value="19">Retención 19%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notas y forma de pago</Label>
        <Textarea
          value={formData.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          placeholder="Detalla la información, el método, y las condiciones de pago o cualquier otra información adicional al documento."
        />
      </div>
    </div>
  );
}
