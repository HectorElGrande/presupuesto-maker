"use client";

import { AppSidebar } from "@/components/tool/app-sidebar";
import { SiteHeader } from "@/components/tool/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Image from "next/image";

import { ThemeProvider } from "@/components/theme-provider";
import { VistaPrevia } from "@/components/vista-previa";
import { useState } from "react";
import TablaConceptos from "@/components/tabla-conceptos";
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
import { DataTable } from "@/components/tool/data-table";

const logo = {
  url: "/",
  src: "/logo-dark.svg",
  alt: "logo",
  title: "QuoteFlow",
};

export default function Page() {
  const [formData, setFormData] = useState({
    numeroPresupuesto: "",
    fechaEmision: "",
    fechaVencimiento: "",
    emisor: {
      nombre: "",
      nif: "",
      direccion: "",
      codigoPostal: "",
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
      codigoPostal: "",
      ciudad: "",
      provincia: "",
      pais: "",
      telefono: "",
      email: "",
    },
    conceptos: [{ descripcion: "", cantidad: 0, precio: 0 }],
    iva: 21,
    irpf: 7,
    observaciones: "",
    estilo: "moderno",
    logo: "",
    mostrarLogo: true,
    tamanoLogo: "S",
  });

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
                          <div className="relative w-8 h-8">
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
                        Previsualización factura
                      </CardTitle>
                      <CardAction>
                        <Badge variant="outline">
                          <IconTrendingUp />
                          PDF
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className="flex flex-col md:flex-row items-start  gap-10 text-sm">
                      <div className="w-full md:w-1/2 px-4 lg:px-6">
                        <DataTable data={[]}/>
                      </div>
                      <div className="w-full md:w-1/2 flex justify-center px-4">
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
