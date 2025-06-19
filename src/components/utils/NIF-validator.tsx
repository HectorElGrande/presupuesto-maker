// utils/validation.ts
export function esNIFValido(nif: string): boolean {
  if (!nif) return false;
    nif = nif.toUpperCase().replace(/[^0-9A-Z]/g, '');

    // Validación para NIF (personas físicas)
    const nifRegExp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (nifRegExp.test(nif)) {
        const numero = parseInt(nif.substring(0, 8), 10);
        const letra = nif.charAt(8);
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        return letras.charAt(numero % 23) === letra;
    }

    // Validación para CIF (empresas)
    const cifRegExp = /^[ABCDEFGHJKLMNPQRSUVW]{1}[0-9]{7}[0-9A-J]$/;
    if (cifRegExp.test(nif)) {
        const provincia = nif.substring(1, 8); // Los 7 dígitos del número

        // Suma de los dígitos en posiciones pares
        let sumaPares = 0;
        for (let i = 1; i < 7; i += 2) {
            sumaPares += parseInt(provincia.charAt(i), 10);
        }

        // Suma de los dígitos en posiciones impares (multiplicar por 2)
        let sumaImpares = 0;
        for (let i = 0; i < 7; i += 2) {
            let digito = parseInt(provincia.charAt(i), 10) * 2;
            sumaImpares += (digito < 10) ? digito : digito - 9;
        }

        const sumaTotal = sumaPares + sumaImpares;
        const control = 10 - (sumaTotal % 10);
        const letraControl = 'JABCDEFGHI'; // Letras de control para CIF

        const ultimoCaracter = nif.charAt(8);
        const primeraLetra = nif.charAt(0);

        // Criterios de validación según el tipo de letra inicial
        if (['A', 'B', 'E', 'H'].includes(primeraLetra)) { // Dígito de control numérico
            return control === parseInt(ultimoCaracter, 10);
        } else if (['K', 'P', 'Q', 'S'].includes(primeraLetra)) { // Dígito de control alfabético
            return letraControl.charAt(control) === ultimoCaracter;
        } else { // Dígito de control alfabético o numérico
            return (control === parseInt(ultimoCaracter, 10)) || (letraControl.charAt(control) === ultimoCaracter);
        }
    }

    // Validación para NIE (extranjeros)
    const nieRegExp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (nieRegExp.test(nif)) {
        let nieTemp = nif.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2');
        const numero = parseInt(nieTemp.substring(0, 8), 10);
        const letra = nieTemp.charAt(8);
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        return letras.charAt(numero % 23) === letra;
    }

    return false;
}
