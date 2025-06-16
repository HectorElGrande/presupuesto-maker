"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { fetchPaises } from "@/components/utils/api-paises";
import { esNIFValido } from "@/components/utils/NIF-validator";

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

interface ModalDatosFiscalesProps {
    tipo: "emisor" | "cliente";
    datos: DatosFiscales;
    setDatos: (d: DatosFiscales) => void;
    abierto: boolean;
    setAbierto: (v: boolean) => void;
}

export function ModalDatosFiscales({
    tipo,
    datos,
    setDatos,
    abierto,
    setAbierto,
}: ModalDatosFiscalesProps) {
    const [temp, setTemp] = useState(datos);
    const [paises, setPaises] = useState<{ name: { common: string }; cca2: string }[]>([]);
    const [errorNif, setErrorNif] = useState("");

    useEffect(() => {
        fetchPaises().then(setPaises);
    }, []);

    useEffect(() => {
        setTemp(datos);
        setErrorNif("");
    }, [abierto]);

    const esEmailValido = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const esTelefonoValido = (telefono: string) => {
        return /^[\d\s()+-]{7,}$/.test(telefono);
    };

    const hayErrores =
        !temp.nombre.trim() ||
        !temp.direccion.trim() ||
        !esEmailValido(temp.email) ||
        !esTelefonoValido(temp.telefono) ||
        !!errorNif;

    const handleInput = (k: keyof DatosFiscales, v: string) => {
        setTemp((prev) => ({ ...prev, [k]: v }));
        if (k === "nif") {
            setErrorNif(v && !esNIFValido(v) ? "Formato NIF incorrecto" : "");
        }
    };

    const handleGuardar = () => {
        if (errorNif) return;
        setDatos(temp);
        setAbierto(false);
    };

    return (
        <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{tipo === "emisor" ? "Emisor" : "Cliente"}</DialogTitle>
                    <p className="text-sm text-muted-foreground">Añade tu información fiscal.</p>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            placeholder="Nombre"
                            value={temp.nombre}
                            onChange={(e) => handleInput("nombre", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nif">NIF *</Label>
                        <Input
                            id="nif"
                            placeholder="12345678A"
                            value={temp.nif}
                            onChange={(e) => handleInput("nif", e.target.value.toUpperCase())}
                        />
                        {errorNif && <p className="text-xs text-red-600 mt-1">{errorNif}</p>}
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                        <Label htmlFor="direccion">Domicilio fiscal</Label>
                        <Input
                            id="direccion"
                            placeholder="Calle, número, etc."
                            value={temp.direccion}
                            onChange={(e) => handleInput("direccion", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cp">Código Postal</Label>
                        <Input
                            id="cp"
                            placeholder="28001"
                            type="text"
                            inputMode="numeric"
                            value={temp.cp}
                            onChange={(e) => handleInput("cp", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="ciudad">Ciudad</Label>
                        <Input
                            id="ciudad"
                            placeholder="Madrid"
                            value={temp.ciudad}
                            onChange={(e) => handleInput("ciudad", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="provincia">Provincia</Label>
                        <Input
                            id="provincia"
                            placeholder="Madrid"
                            value={temp.provincia}
                            onChange={(e) => handleInput("provincia", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="pais">País</Label>
                        <Select
                            onValueChange={(v) => handleInput("pais", v)}
                            value={temp.pais || undefined}
                        >
                            <SelectTrigger id="pais" className="cursor-pointer">
                                <SelectValue placeholder="Selecciona país" />
                            </SelectTrigger>
                            <SelectContent>
                                {paises.map((p) => (
                                    <SelectItem className="cursor-pointer" key={p.cca2} value={p.name.common}>
                                        {p.name.common}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="telefono">Teléfono / Móvil *</Label>
                        <Input
                            id="telefono"
                            placeholder="+34 600 123 456"
                            type="tel"
                            value={temp.telefono}
                            onChange={(e) => handleInput("telefono", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input
                            id="email"
                            placeholder="micorreo@ejemplo.com"
                            type="email"
                            value={temp.email}
                            onChange={(e) => handleInput("email", e.target.value)}
                        />
                        {temp.email && !esEmailValido(temp.email) && (
                            <p className="text-xs text-red-600 mt-1">Correo no válido</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <Button onClick={handleGuardar} disabled={hayErrores} className="px-6 cursor-pointer">
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
