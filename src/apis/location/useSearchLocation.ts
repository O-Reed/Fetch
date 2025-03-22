import { useQuery } from "@tanstack/react-query";

import { LocationSearchParams, LocationSearchResponse } from "@/types";
import { api } from "@/config/axios";

export const useLocationSearch = (searchParams: LocationSearchParams) => {
  return useQuery<LocationSearchResponse>({
    queryKey: ["locationSearch", searchParams],
    queryFn: async () => {
      const { data } = await api.post<LocationSearchResponse>(
        "/locations/search",
        searchParams
      );
      return data;
    },
    enabled: false
  });
};
