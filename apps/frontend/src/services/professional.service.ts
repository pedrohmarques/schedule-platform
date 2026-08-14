import { api } from "@/lib/api";
import { Professional } from "@/types/Professional";

export function findByArea(area: string) {
    const params = new URLSearchParams({ area });
    return api<Professional[]>(`/professional?${params.toString()}`);
  }