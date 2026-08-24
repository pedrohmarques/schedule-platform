import { api } from "@/lib/api";
import { ProfessionalListItem } from "@/types/User";

export function findByArea(area: string) {
    const params = new URLSearchParams({ area });
    return api<ProfessionalListItem[]>(`/professional?${params.toString()}`);
  }