// utils/api.ts
export async function fetchPaises() {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
  if (!res.ok) throw new Error('Error fetching countries');
  const data: Array<{ name: { common: string }; cca2: string }> = await res.json();
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}
