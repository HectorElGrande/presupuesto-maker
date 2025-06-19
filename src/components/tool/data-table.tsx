"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconTrendingUp,
  IconTrash,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Importar Card components

// Nuevo import del componente de formulario de datos fiscales
import { DatosFiscalesForm } from "@/components/tool/datos-fiscales-form";

// Define el tipo de DatosFiscales para consistencia (copia de datos-fiscales-form.tsx)
interface DatosFiscales {
  nombre: string;
  nif: string;
  direccion: string;
  cp: string;
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
}

// Define el esquema de tus conceptos para la tabla
export const schema = z.object({
  id: z.number(),
  descripcion: z.string(),
  cantidad: z.number(),
  precio: z.number(),
});

// Define el tipo completo de formData
interface FormData {
  numeroPresupuesto: string;
  fechaEmision: string;
  fechaVencimiento: string;
  emisor: DatosFiscales;
  cliente: DatosFiscales;
  conceptos: z.infer<typeof schema>[];
  iva: number;
  irpf: number;
  observaciones: string;
  estilo: string;
  logo: string;
  mostrarLogo: boolean;
  tamanoLogo: string;
}

// --- Componente DragHandle con estilos de cursor ---
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners, isDragging } = useSortable({
    id: id.toString(),
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className={`text-muted-foreground size-7 hover:bg-transparent ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Arrastrar para reordenar</span>
    </Button>
  );
}

// --- Definiciones de Columnas actualizadas ---
const getColumns = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
): ColumnDef<z.infer<typeof schema>>[] => [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
          className="cursor-pointer"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="cursor-pointer"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row, table }) => {
      const updateRow = (table.options.meta as any)?.updateRow;
      return (
        <TableCellViewer
          item={row.original}
          onUpdate={(updatedItem) => updateRow(row.original.id, updatedItem)}
        />
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "cantidad",
    header: () => <div className="w-full text-right">Cantidad</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.original.cantidad}</div>;
    },
  },
  {
    accessorKey: "precio",
    header: () => <div className="w-full text-right">Precio</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.original.precio.toFixed(2)} €</div>;
    },
  },
  {
    id: "total",
    header: () => <div className="w-full text-right">Total</div>,
    cell: ({ row }) => {
      const total = row.original.cantidad * row.original.precio;
      return <div className="font-medium text-right">{total.toFixed(2)} €</div>;
    },
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => {
              const newRow = {
                ...row.original,
                id: Math.max(0, ...(table.options.data as z.infer<typeof schema>[]).map((d) => d.id)) + 1,
              };
              (table.options.meta as any)?.addRow(newRow);
              toast.success(`Copia de "${newRow.descripcion}" añadida.`);
            }}
            className="cursor-pointer"
          >
            Hacer una copia
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              (table.options.meta as any)?.removeRow(row.original.id);
              toast.success(`"${row.original.descripcion}" eliminada.`);
            }}
            className="cursor-pointer"
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// --- DraggableRow Component ---
function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id.toString(),
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// --- DataTable Component ---
export function DataTable({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("emisor"); // Estado para la pestaña activa, por defecto "emisor"

  const conceptos = formData.conceptos;

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => conceptos?.map(({ id }) => id.toString()) || [],
    [conceptos],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      descripcion: true,
      cantidad: true,
      precio: true,
      total: true,
      actions: true,
      drag: true,
      select: true,
    });

  // Efecto para ocultar/mostrar columnas basado en si es móvil.
  React.useEffect(() => {
    if (isMobile) {
      setColumnVisibility((prev) => ({
        ...prev,
        total: false,
      }));
    } else {
      setColumnVisibility((prev) => ({
        ...prev,
        cantidad: true,
        precio: true,
        total: true,
      }));
    }
  }, [isMobile]);

  const columns = React.useMemo(() => getColumns(setFormData), [setFormData]);

  const table = useReactTable({
    data: conceptos,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    columnResizeMode: "onChange",
    meta: {
      addRow: (newRow: z.infer<typeof schema>) => {
        setFormData((prev) => ({
          ...prev,
          conceptos: [...prev.conceptos, newRow],
        }));
      },
      removeRow: (id: UniqueIdentifier) => {
        setFormData((prev) => ({
          ...prev,
          conceptos: prev.conceptos.filter((d) => d.id !== id),
        }));
      },
      updateRow: (id: UniqueIdentifier, updatedFields: Partial<z.infer<typeof schema>>, showToast: boolean = true) => {
        setFormData((prev) => {
          const newConceptos = prev.conceptos.map(row => row.id === id ? { ...row, ...updatedFields } : row);
          if (showToast) {
            toast.success("Concepto actualizado.");
          }
          return { ...prev, conceptos: newConceptos };
        });
      },
      removeSelectedRows: (selectedRowIds: UniqueIdentifier[]) => {
        setFormData((prev) => {
          const newConceptos = prev.conceptos.filter(row => !selectedRowIds.includes(row.id));
          setRowSelection({});
          toast.success(`${selectedRowIds.length} concepto(s) eliminado(s).`);
          return { ...prev, conceptos: newConceptos };
        });
      }
    }
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newConceptos = arrayMove(prev.conceptos, oldIndex, newIndex);
        return { ...prev, conceptos: newConceptos };
      });
    }
  }

  function addNewRow() {
    const maxId = Math.max(0, ...conceptos.map((d) => d.id));
    const newRow = {
      id: maxId + 1,
      descripcion: "Nuevo Concepto",
      cantidad: 0,
      precio: 0,
    };
    setFormData((prev) => ({
      ...prev,
      conceptos: [...prev.conceptos, newRow],
    }));
  }

  const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
  const canDeleteSelected = selectedRowIds.length > 0;

  // Handler genérico para actualizar campos directamente en formData
  const handleFormDataChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler para actualizar datos anidados (emisor, cliente)
  const handleNestedFormDataChange = (
    parentField: "emisor" | "cliente",
    updatedDatos: DatosFiscales
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: updatedDatos,
    }));
  };

  const showConceptButtons = activeTab === "conceptos"; // Controla la visibilidad de los botones

  return (
    <Tabs
      defaultValue="emisor" // Pestaña inicial: Emisor
      className="flex w-full flex-col justify-start gap-6"
      onValueChange={setActiveTab} // Actualiza el estado de la pestaña activa
    >
      <div className="flex flex-col items-start gap-2 px-4 md:flex-row md:flex-wrap md:justify-between md:items-center lg:px-6">
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start">
          <Label htmlFor="view-selector" className="sr-only">
            Vista
          </Label>
          <Select value={activeTab} onValueChange={setActiveTab}> {/* Controla el Select con el estado */}
            <SelectTrigger
              className="flex w-fit cursor-pointer lg:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Seleccionar vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emisor">Datos Emisor</SelectItem>
              <SelectItem value="cliente">Datos Cliente</SelectItem>
              <SelectItem value="conceptos">Conceptos</SelectItem>
              <SelectItem value="documento">Detalles Documento</SelectItem>
            </SelectContent>
          </Select>

          {/* Nuevas pestañas para desktop */}
          <TabsList className="**\:data-[slot=badge]:bg-muted-foreground/30 **\:data-[slot=badge]:size-5 **\:data-[slot=badge]:rounded-full **\:data-[slot=badge]:px-1 hidden lg:flex flex-wrap">
            <TabsTrigger value="emisor" className="cursor-pointer">Datos Emisor</TabsTrigger>
            <TabsTrigger value="cliente" className="cursor-pointer">Datos Cliente</TabsTrigger>
            <TabsTrigger value="conceptos" className="cursor-pointer">Conceptos</TabsTrigger>
            <TabsTrigger value="documento" className="cursor-pointer">Detalles Documento</TabsTrigger>
          </TabsList>
        </div>

        {/* Botones condicionales */}
        {showConceptButtons && (
          <div className="flex w-full flex-wrap items-center justify-end gap-2 mt-2 md:w-auto md:mt-0">
            {canDeleteSelected && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => (table.options.meta as any)?.removeSelectedRows(selectedRowIds)}
                className="cursor-pointer border-red-300 text-red-500 hover:border-red-400 hover:text-red-600"
              >
                <IconTrash className="size-4" />
                <span className="hidden lg:inline">Eliminar seleccionados ({selectedRowIds.length})</span>
                <span className="inline lg:hidden">({selectedRowIds.length})</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Personalizar Columnas</span>
                  <span className="sr-only lg:hidden">Columnas</span>
                  <IconChevronDown className="ml-1 hidden lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      column.id !== "drag" && column.id !== "select" && column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={addNewRow} className="cursor-pointer">
              <IconPlus />
              <span className="hidden lg:inline">Añadir Concepto</span>
              <span className="sr-only lg:hidden">Añadir</span>
            </Button>
          </div>
        )}
      </div>

      {/* TAB: Datos Emisor */}
      <TabsContent value="emisor" className="flex flex-col gap-6 px-4 lg:px-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Información del Emisor</CardTitle>
                <CardDescription>Completa los datos fiscales de la entidad emisora del presupuesto.</CardDescription>
            </CardHeader>
            <CardContent>
                <DatosFiscalesForm
                    tipo="emisor"
                    datos={formData.emisor}
                    onUpdate={(updatedDatos) => handleNestedFormDataChange("emisor", updatedDatos)}
                />
            </CardContent>
        </Card>
      </TabsContent>

      {/* TAB: Datos Cliente */}
      <TabsContent value="cliente" className="flex flex-col gap-6 px-4 lg:px-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Información del Cliente</CardTitle>
                <CardDescription>Introduce los datos fiscales de tu cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <DatosFiscalesForm
                    tipo="cliente"
                    datos={formData.cliente}
                    onUpdate={(updatedDatos) => handleNestedFormDataChange("cliente", updatedDatos)}
                />
            </CardContent>
        </Card>
      </TabsContent>

      {/* TAB: Conceptos */}
      <TabsContent
        value="conceptos"
        className="relative flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**\:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados. Añade un concepto para empezar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-4 md:w-auto md:justify-end">
            <div className="hidden items-center gap-2 sm:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Filas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20 cursor-pointer" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 sm:flex cursor-pointer"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la primera página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir a la página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8 cursor-pointer"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la página siguiente</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 sm:flex cursor-pointer"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir a la última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* TAB: Detalles del Documento (nueva) */}
      <TabsContent value="documento" className="flex flex-col gap-6 px-4 lg:px-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Información del Presupuesto</CardTitle>
                <CardDescription>Define las fechas, número y condiciones de tu presupuesto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fechaEmision">Fecha de emisión</Label>
                    <Input
                    id="fechaEmision"
                    type="date"
                    value={formData.fechaEmision || ""}
                    onChange={(e) => handleFormDataChange("fechaEmision", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
                    <Input
                    id="fechaVencimiento"
                    type="date"
                    value={formData.fechaVencimiento || ""}
                    onChange={(e) => handleFormDataChange("fechaVencimiento", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="numeroPresupuesto">Número de Presupuesto</Label>
                    <Input
                    id="numeroPresupuesto"
                    placeholder="Num. Presupuesto"
                    value={formData.numeroPresupuesto || ""}
                    onChange={(e) => handleFormDataChange("numeroPresupuesto", e.target.value)}
                    />
                </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="iva">IVA</Label>
                    <Select
                    onValueChange={(value) => handleFormDataChange("iva", parseFloat(value))}
                    value={formData.iva?.toString() || ""}
                    >
                    <SelectTrigger className="cursor-pointer" id="iva">
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
                    <Label htmlFor="irpf">IRPF</Label>
                    <Select
                    onValueChange={(value) => handleFormDataChange("irpf", parseFloat(value))}
                    value={formData.irpf?.toString() || ""}
                    >
                    <SelectTrigger className="cursor-pointer" id="irpf">
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

                <Separator />

                <div className="space-y-2">
                <Label htmlFor="observaciones">Notas y forma de pago</Label>
                <Textarea
                    id="observaciones"
                    value={formData.observaciones || ""}
                    onChange={(e) => handleFormDataChange("observaciones", e.target.value)}
                    placeholder="Ej: Pago mediante transferencia en 15 días. IBAN: ES00 0000 0000 0000"
                />
                </div>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// TableCellViewer se mantiene igual
function TableCellViewer({ item, onUpdate }: { item: z.infer<typeof schema>, onUpdate: (updatedItem: Partial<z.infer<typeof schema>>) => void }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const [localItem, setLocalItem] = React.useState(item);

  React.useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setLocalItem((prev) => ({
      ...prev,
      [id.replace('drawer-', '')]: (id === 'drawer-cantidad' || id === 'drawer-precio') ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatePromise = new Promise((resolve) => {
      setTimeout(() => {
        onUpdate(localItem);
        resolve("Cambios guardados.");
      }, 500);
    });

    toast.promise(updatePromise, {
      loading: `Guardando cambios para ${localItem.descripcion}`,
      success: (data) => {
        setOpen(false);
        return data;
      },
      error: "Error al guardar cambios.",
    });
  };

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--primary)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;


  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="w-fit cursor-pointer px-0 text-left text-foreground">
          {item.descripcion}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.descripcion}</DrawerTitle>
          <DrawerDescription>
            Detalles del Concepto
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Información adicional del concepto{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Aquí puedes añadir más detalles o un resumen del concepto.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="drawer-descripcion">Descripción</Label>
              <Input
                id="drawer-descripcion"
                value={localItem.descripcion}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-cantidad">Cantidad</Label>
                <Input
                  type="number"
                  id="drawer-cantidad"
                  value={localItem.cantidad}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="drawer-precio">Precio</Label>
                <Input
                  type="number"
                  id="drawer-precio"
                  value={localItem.precio}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Total</Label>
                <Input value={(localItem.cantidad * localItem.precio).toFixed(2) + ' €'} readOnly />
            </div>
            <DrawerFooter>
              <Button type="submit" className="cursor-pointer">Guardar Cambios</Button>
              <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>Cerrar</Button>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}