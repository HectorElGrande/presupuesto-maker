// utils/validation.ts
export function esNIFValido(nif: string): boolean {
  const re = /^[0-9]{8}[A-Z]$/;
  return re.test(nif);
}
