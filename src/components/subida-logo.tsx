"use client";

import { Input } from "@/components/ui/input";

export function SubidaLogo({ setLogo }: { setLogo: (logo: string) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setLogo(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1">
      <Input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
