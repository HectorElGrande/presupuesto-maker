"use client";

import { useEffect, useState, useCallback } from "react"; // Importar useCallback
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { debounce } from 'lodash'; // Necesitas instalar lodash o crear tu propio debounce
// npm install lodash
// npm install @types/lodash --save-dev

// Importar useLoadScript y usePlacesService de @react-google-maps/api
// NOTA: useLoadScript no es necesario aquí porque el padre DataTable ya lo maneja
// Pero usePlacesService sí se usará para obtener los Place details
// Importa usePlacesService si necesitas los Place Details
import { useLoadScript, Libraries } from '@react-google-maps/api';

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

interface DatosFiscalesFormProps {
    tipo: "emisor" | "cliente";
    datos: DatosFiscales;
    onUpdate: (updatedDatos: DatosFiscales) => void;
    readOnly?: boolean;
    googleMapsApiKey: string; // Recibe la API Key del padre
}


export function DatosFiscalesForm({
    tipo,
    datos,
    onUpdate,
    readOnly = false,
    googleMapsApiKey,
}: DatosFiscalesFormProps) {
    const [tempDatos, setTempDatos] = useState<DatosFiscales>(datos);
    const [paises, setPaises] = useState<{ name: { common: string }; cca2: string }[]>([]);
    const [errorNif, setErrorNif] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorTelefono, setErrorTelefono] = useState("");

    // Estado para el autocompletado
    const [addressSuggestions, setAddressSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

    // Usa usePlacesService hook para obtener el servicio de Google Places
    // Este hook se asegurará de que el servicio esté disponible una vez que la API se haya cargado
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
        libraries: ['places'] as Libraries, // Tipado explícito para Libraries
    });

    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);

    // Inicializar servicios de Google Maps Places una vez que isLoaded sea true
    useEffect(() => {
        if (isLoaded && !loadError && window.google?.maps?.places) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            // PlacesService necesita un div dummy para inicializarse.
            // Para fines de simplicidad y si no usas un mapa visible, puedes crear un div temporal
            const dummyDiv = document.createElement('div');
            setPlacesService(new window.google.maps.places.PlacesService(dummyDiv));
        }
    }, [isLoaded, loadError]);


    useEffect(() => {
        fetchPaises().then(setPaises);
    }, []);

    useEffect(() => {
        setTempDatos(datos);
        setErrorNif("");
        setErrorEmail("");
        setErrorTelefono("");
    }, [datos]);


    const esEmailValido = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const esTelefonoValido = (telefono: string) => {
        return /^[\d\s()+-]{7,}$/.test(telefono.replace(/[\s()+-]/g, ''));
    };

    // Función debounced para obtener sugerencias de dirección
    const getAddressPredictionsDebounced = useCallback(
      debounce((input: string) => {
        if (autocompleteService && input.length > 2) {
          setIsFetchingSuggestions(true);
          setShowAddressSuggestions(true);
          const request: google.maps.places.AutocompletionRequest = {
            input: input,
            componentRestrictions: tempDatos.pais ? { country: [paises.find(p => p.name.common === tempDatos.pais)?.cca2.toLowerCase() || 'es'] } : undefined,
            types: ['address'],
          };
          autocompleteService.getPlacePredictions(request, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setAddressSuggestions(predictions);
            } else {
              setAddressSuggestions([]);
            }
            setIsFetchingSuggestions(false);
          });
        } else {
            setAddressSuggestions([]);
            setShowAddressSuggestions(false);
        }
      }, 500), // Debounce de 500ms
      [autocompleteService, tempDatos.pais, paises]
    );

    const handleInputChange = (k: keyof DatosFiscales, v: string) => {
        setTempDatos((prev) => ({ ...prev, [k]: v }));

        if (k === "nif") {
            setErrorNif(v && !esNIFValido(v) ? "Formato NIF/CIF incorrecto" : "");
        } else if (k === "email") {
            setErrorEmail(v && !esEmailValido(v) ? "Correo no válido" : "");
        } else if (k === "telefono") {
            setErrorTelefono(v && !esTelefonoValido(v) ? "Teléfono no válido (mín. 7 dígitos)" : "");
        }

        if (k === "direccion") {
            getAddressPredictionsDebounced(v);
        }
    };


    const handleAddressSelect = (prediction: google.maps.places.AutocompletePrediction) => {
        // Actualiza el campo de dirección con la descripción completa inmediatamente
        setTempDatos((prev) => ({ ...prev, direccion: prediction.description }));
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);

        if (placesService) {
            placesService.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ['address_components', 'formatted_address'] // Campos importantes
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place?.address_components) {
                        const newAddressDetails: Partial<DatosFiscales> = {};
                        let streetName = '';
                        let streetNumber = '';

                        place.address_components.forEach(component => {
                            if (component.types.includes('street_number')) {
                                streetNumber = component.long_name;
                            } else if (component.types.includes('route')) {
                                streetName = component.long_name;
                            } else if (component.types.includes('postal_code')) {
                                newAddressDetails.cp = component.long_name;
                            } else if (component.types.includes('locality')) {
                                newAddressDetails.ciudad = component.long_name;
                            } else if (component.types.includes('administrative_area_level_2') || component.types.includes('administrative_area_level_1')) {
                                // Prefer administrative_area_level_2 for more specific province/state
                                newAddressDetails.provincia = component.long_name;
                            } else if (component.types.includes('country')) {
                                newAddressDetails.pais = component.long_name;
                            }
                        });

                        // Construir dirección más precisa: "Calle Número"
                        let fullAddress = streetName;
                        if (streetNumber) {
                            fullAddress += `, ${streetNumber}`; // O `${streetName} ${streetNumber}` si prefieres
                        }
                        // Usar formatted_address de Google si es más completo, o la combinación que hemos hecho
                        newAddressDetails.direccion = place.formatted_address || fullAddress || prediction.description;


                        setTempDatos((prev) => ({
                            ...prev,
                            ...newAddressDetails,
                            // Asegurarse de que el país sea el nombre común y no el código si se autocompleta
                            // Aquí se asume que newAddressDetails.pais ya es el nombre común.
                            // Si google devuelve el código, necesitas mapearlo.
                            pais: newAddressDetails.pais || prev.pais,
                        }));
                    } else {
                        toast.warning("No se pudieron obtener todos los detalles de la dirección seleccionada.");
                    }
                }
            );
        }
    };


    const hayErrores =
        !tempDatos.nombre.trim() ||
        !tempDatos.direccion.trim() ||
        !tempDatos.cp.trim() ||
        !tempDatos.ciudad.trim() ||
        !tempDatos.provincia.trim() ||
        !tempDatos.pais.trim() ||
        !!errorNif ||
        !!errorEmail ||
        !!errorTelefono;


    const handleGuardar = () => {
        if (errorNif || errorEmail || errorTelefono || hayErrores) {
            toast.error("Por favor, corrige los errores en el formulario antes de guardar.");
            return;
        }

        onUpdate(tempDatos);
        toast.success(`Datos de ${tipo === 'emisor' ? 'emisor' : 'cliente'} actualizados.`);
    };

    if (loadError) return <div>Error al cargar Google Maps</div>;
    if (!isLoaded) return <div>Cargando formulario...</div>; // O un spinner

    return (
        <div className="flex flex-col gap-4">
            {/* NO NECESITAMOS EL DIV DUMMY AQUÍ SI USAMOS usePlacesService */}
            {/* <div ref={placesServiceDivRef} style={{ display: 'none' }} /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-nombre`}>Nombre *</Label>
                    <Input
                        id={`${tipo}-nombre`}
                        placeholder="Nombre"
                        value={tempDatos.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-nif`}>NIF/CIF *</Label>
                    <Input
                        id={`${tipo}-nif`}
                        placeholder="12345678A"
                        value={tempDatos.nif}
                        onChange={(e) => handleInputChange("nif", e.target.value.toUpperCase())}
                        disabled={readOnly}
                    />
                    {errorNif && <p className="text-xs text-red-600 mt-1">{errorNif}</p>}
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-direccion`}>Domicilio fiscal *</Label>
                    {/* Popover para el autocompletado */}
                    <Popover open={showAddressSuggestions && addressSuggestions.length > 0} onOpenChange={setShowAddressSuggestions}>
                        <PopoverTrigger asChild>
                            <Input
                                id={`${tipo}-direccion`}
                                placeholder="Calle, número, etc."
                                value={tempDatos.direccion}
                                onChange={(e) => handleInputChange("direccion", e.target.value)}
                                disabled={readOnly}
                                // Asegúrate de que el Popover se cierre cuando el input pierde el foco si no hay sugerencias
                                onBlur={() => {
                                    if (addressSuggestions.length === 0) {
                                        setShowAddressSuggestions(false);
                                    }
                                }}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Buscar dirección..." value={tempDatos.direccion} onValueChange={(value) => handleInputChange("direccion", value)} />
                                <CommandList>
                                    {isFetchingSuggestions && (
                                        <CommandEmpty>Cargando sugerencias...</CommandEmpty>
                                    )}
                                    {!isFetchingSuggestions && addressSuggestions.length === 0 && (
                                        <CommandEmpty>No se encontraron sugerencias.</CommandEmpty>
                                    )}
                                    <CommandGroup>
                                        {addressSuggestions.map((prediction) => (
                                            <CommandItem
                                                key={prediction.place_id}
                                                onSelect={() => handleAddressSelect(prediction)}
                                                className="cursor-pointer"
                                            >
                                                {prediction.description}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-cp`}>Código Postal *</Label>
                    <Input
                        id={`${tipo}-cp`}
                        placeholder="28001"
                        type="text"
                        inputMode="numeric"
                        value={tempDatos.cp}
                        onChange={(e) => handleInputChange("cp", e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-ciudad`}>Ciudad *</Label>
                    <Input
                        id={`${tipo}-ciudad`}
                        placeholder="Madrid"
                        value={tempDatos.ciudad}
                        onChange={(e) => handleInputChange("ciudad", e.target.value)}
                        disabled={readOnly}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-provincia`}>Provincia *</Label>
                    <Input
                        id={`${tipo}-provincia`}
                        placeholder="Madrid"
                        value={tempDatos.provincia}
                        onChange={(e) => handleInputChange("provincia", e.target.value)}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor={`${tipo}-pais`}>País *</Label>
                    <Select
                        onValueChange={(v) => handleInputChange("pais", v)}
                        value={tempDatos.pais || undefined}
                        disabled={readOnly}
                    >
                        <SelectTrigger id={`${tipo}-pais`} className="cursor-pointer">
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
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-telefono`}>Teléfono / Móvil *</Label>
                    <Input
                        id={`${tipo}-telefono`}
                        placeholder="+34 600 123 456"
                        type="tel"
                        value={tempDatos.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        disabled={readOnly}
                    />
                    {errorTelefono && <p className="text-xs text-red-600 mt-1">{errorTelefono}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${tipo}-email`}>Correo electrónico *</Label>
                    <Input
                        id="drawer-email"
                        placeholder="micorreo@ejemplo.com"
                        type="email"
                        value={tempDatos.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={readOnly}
                    />
                    {errorEmail && <p className="text-xs text-red-600 mt-1">{errorEmail}</p>}
                </div>
            </div>

            {!readOnly && (
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleGuardar} disabled={hayErrores} className="cursor-pointer">
                        Guardar
                    </Button>
                </div>
            )}
        </div>
    );
}