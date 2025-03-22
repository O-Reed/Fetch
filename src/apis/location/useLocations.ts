import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/axios";
import { Location } from "@/types";

export const useLocations = (zipCodes: string[]) => {
  return useQuery<Location[]>({
    queryKey: ["locations", zipCodes],
    queryFn: async () => {
      if (!zipCodes.length) {
        return [];
      }
      if (zipCodes.length > 100) {
        throw new Error("Invalid number of ZIP codes. Maximum is 100.");
      }
      const { data } = await api.post<Location[]>("/locations", zipCodes);
      return data;
    },
    enabled: zipCodes.length > 0
  });
};
