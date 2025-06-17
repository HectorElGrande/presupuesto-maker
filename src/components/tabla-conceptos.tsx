"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GripVertical, Trash2 } from "lucide-react";
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
import { useState } from "react";

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
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="hover:bg-muted/50"
    >
      <TableCell {...listeners} className="text-muted-foreground border w-10">
        <GripVertical className="w-4 h-4 cursor-grab" />
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function TablaConceptos({ formData, setFormData }: any) {
  const sensors = useSensors(useSensor(PointerSensor));

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const totalPages = Math.ceil(formData.conceptos.length / rowsPerPage);

  const updateConcepto = (index: number, field: string, value: any) => {
    const nuevos = [...formData.conceptos];
    nuevos[index][field] =
      field === "precio" || field === "cantidad"
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
        { descripcion: "", cantidad: 0, precio: 0 },
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

  const paginatedConceptos = formData.conceptos.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-10 border" />
                <TableHead className="border min-w-[150px]">Descripción</TableHead>
                <TableHead className="border min-w-[100px]">Precio</TableHead>
                <TableHead className="border min-w-[100px]">Unidades</TableHead>
                <TableHead className="border text-right min-w-[100px]">Total</TableHead>
                <TableHead className="w-10 border" />
              </TableRow>
            </TableHeader>
            <SortableContext
              items={paginatedConceptos.map((_: any, i: number) => ((page - 1) * rowsPerPage + i).toString())}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {paginatedConceptos.map((concepto: any, i: number) => {
                  const globalIndex = (page - 1) * rowsPerPage + i;
                  return (
                    <SortableRow key={globalIndex} id={globalIndex.toString()}>
                      <TableCell className="border min-w-[150px]">
                        <Input
                          placeholder="Descripción"
                          className="h-8"
                          value={concepto.descripcion}
                          onChange={(e) =>
                            updateConcepto(globalIndex, "descripcion", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="border min-w-[100px]">
                        <Input
                          type="number"
                          className="h-8"
                          value={concepto.precio.toString()}
                          onChange={(e) =>
                            updateConcepto(globalIndex, "precio", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="border min-w-[100px]">
                        <Input
                          type="number"
                          className="h-8"
                          value={concepto.cantidad.toString()}
                          onChange={(e) =>
                            updateConcepto(globalIndex, "cantidad", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="border text-right pr-2 min-w-[100px]">
                        {(concepto.precio * concepto.cantidad).toFixed(2)}€
                      </TableCell>
                      <TableCell className="border w-10">
                        <Button
                          className="cursor-pointer"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeConcepto(globalIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </SortableRow>
                  );
                })}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
      </DndContext>

      {/* Controles inferiores alineados correctamente */}
      <div className="flex justify-between items-center mt-2">
        {/* Botón añadir */}
        <Button
          variant="link"
          size="sm"
          onClick={addConcepto}
          className="cursor-pointer"
        >
          + Añadir
        </Button>

        {/* Paginación completa */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Filas por página</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setPage(1); // resetea a la primera página
                setRowsPerPage(Number(value));
              }}
            >
              <SelectTrigger className="h-8 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 8, 12, 16, 20].map((n) => (
                  <SelectItem className="cursor-pointer" key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm whitespace-nowrap">
              Página {page} de {totalPages}
            </span>
            <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

    </>
  );
}
