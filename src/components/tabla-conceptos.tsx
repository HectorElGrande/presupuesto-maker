"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({ id, children }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell {...listeners} className="text-muted-foreground">
        <GripVertical className="w-4 h-4 cursor-grab" />
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function TablaConceptos({ formData, setFormData }: any) {
  const sensors = useSensors(useSensor(PointerSensor));

  const updateConcepto = (index: number, field: string, value: any) => {
    const nuevos = [...formData.conceptos];
    nuevos[index][field] = field === "precio" || field === "cantidad"
      ? parseFloat(value) || 0
      : value;
    setFormData({ ...formData, conceptos: nuevos });
  };

  const removeConcepto = (index: number) => {
    const nuevos = [...formData.conceptos];
    nuevos.splice(index, 1);
    setFormData({ ...formData, conceptos: nuevos });
  };

  const addConcepto = () => {
    setFormData({
      ...formData,
      conceptos: [
        ...formData.conceptos,
        { descripcion: "", cantidad: 1, precio: 0 },
      ],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    const nuevos = arrayMove(formData.conceptos, oldIndex, newIndex);
    setFormData({ ...formData, conceptos: nuevos });
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Concepto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <SortableContext
            items={formData.conceptos.map((_: any, i: number) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {formData.conceptos.map((concepto: any, i: number) => (
                <SortableRow key={i} id={i.toString()}>
                  <TableCell>
                    <Input
                      className="h-8"
                      value={concepto.descripcion}
                      onChange={(e) => updateConcepto(i, "descripcion", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="h-8"
                      value={concepto.precio.toString()}
                      onChange={(e) => updateConcepto(i, "precio", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="h-8"
                      value={concepto.cantidad.toString()}
                      onChange={(e) => updateConcepto(i, "cantidad", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-right pr-2">
                    {(concepto.precio * concepto.cantidad).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => removeConcepto(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </SortableRow>
              ))}
            </TableBody>
          </SortableContext>
        </Table>
      </DndContext>
      
      <Button variant="link" size="sm" onClick={addConcepto} className="mt-2 cursor-pointer">
        + Añadir
      </Button>
    </>
  );
}
