import { useQuery } from "@tanstack/react-query";

import { useDogs } from "./useDogs";

import { api } from "@/config/axios";
import { DogSearchResponse, DogSearchParams } from "@/types";

export const useSearchDogs = (DogSearchParams: DogSearchParams) => {
  const { data: allSearchDogs, ...rest } = useQuery<DogSearchResponse>({
    queryKey: ["SearchDogs", DogSearchParams],
    queryFn: () => api.get("/dogs/search", {params: DogSearchParams}),
  });

  const DogDetails = useDogs(allSearchDogs?.resultIds ?? []);
  return { allSearchDogs, DogDetails, ...rest };
};
