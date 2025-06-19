"use client";

import { AppSidebar } from "@/components/tool/app-sidebar";
import { SiteHeader } from "@/components/tool/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Image from "next/image";

import { ThemeProvider } from "@/components/theme-provider";
import { VistaPrevia } from "@/components/vista-previa";
import { useState } from "react";
// import TablaConceptos from "@/components/tabla-conceptos"; // Esto probablemente ya no lo necesites si DataTable lo reemplaza
import { IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/footer";
// Importamos DataTable y el schema de los conceptos si lo necesitamos en otros sitios
import { DataTable, schema } from "@/components/tool/data-table";

// Define el tipo de DatosFiscales para consistencia
interface DatosFiscales {
  nombre: string;
  nif: string;
  direccion: string;
  cp: string; // Asegúrate de que este es el campo correcto, no 'codigoPostal'
  ciudad: string;
  provincia: string;
  pais: string;
  telefono: string;
  email: string;
}

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


const logo = {
  url: "/",
  src: "/logo-dark.svg",
  alt: "logo",
  title: "QuoteFlow",
};

export default function Page() {
  const [formData, setFormData] = useState<FormData>({ // Usamos el tipo FormData
    numeroPresupuesto: "",
    fechaEmision: "",
    fechaVencimiento: "",
    emisor: {
      nombre: "",
      nif: "",
      direccion: "",
      // Importante: Asegúrate de que los nombres de las propiedades coinciden con DatosFiscales
      cp: "", // Usar 'cp' en lugar de 'codigoPostal'
      ciudad: "",
      provincia: "",
      pais: "",
      telefono: "",
      email: "",
    },
    cliente: {
      nombre: "",
      nif: "",
      direccion: "",
      // Importante: Asegúrate de que los nombres de las propiedades coinciden con DatosFiscales
      cp: "", // Usar 'cp' en lugar de 'codigoPostal'
      ciudad: "",
      provincia: "",
      pais: "",
      telefono: "",
      email: "",
    },
    conceptos: [], // Deja vacío para empezar o con datos de ejemplo
    iva: 21,
    irpf: 7,
    observaciones: "",
    estilo: "moderno",
    logo: "",
    mostrarLogo: true,
    tamanoLogo: "S",
  });

  // La función handleConceptsChange ya no es necesaria aquí porque DataTable gestiona formData directamente.
  // Pero la mantenemos como un comentario por si la necesitas para depurar o en otra parte.
  /*
  const handleConceptsChange = (newConcepts: z.infer<typeof schema>[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      conceptos: newConcepts,
    }));
  };
  */

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <Card className="@container/card">
                    <CardHeader>
                      <CardDescription>
                        <a href={logo.url} className="flex items-center gap-2">
                          <div className="relative h-8 w-8">
                            <Image
                              src="/logo-light.svg"
                              alt="QuoteFlow Logo Claro"
                              fill
                              className="block dark:hidden object-contain"
                            />
                            <Image
                              src="/logo-dark.svg"
                              alt="QuoteFlow Logo Oscuro"
                              fill
                              className="hidden dark:block object-contain"
                            />
                          </div>
                          <span className="text-lg font-semibold tracking-tighter">
                            {logo.title}
                          </span>
                        </a>
                      </CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        Previsualización presupuesto
                      </CardTitle> {/* Título actualizado a 'presupuesto' */}
                      <CardAction>
                        <Badge variant="outline">
                          <IconTrendingUp />
                          PDF
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex flex-col md:flex-row items-start gap-10 text-sm">
                      <div className="w-full md:w-1/2 overflow-x-auto">
                        {/* CAMBIO CLAVE: Pasar formData y setFormData directamente a DataTable */}
                        <DataTable
                          formData={formData}
                          setFormData={setFormData}
                        />
                      </div>
                      <div className="w-full md:w-1/2 flex justify-center flex-grow">
                        <VistaPrevia
                          formData={formData}
                          setFormData={setFormData}
                        />
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}