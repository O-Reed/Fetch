import { useQuery } from "@tanstack/react-query";

import { api } from "@/config/axios";
import { Dog } from "@/types";

export const useDogs = (DogParams: String[]) => {
  const { data: allDogs, ...rest } = useQuery<Dog>({
    queryKey: ["dogs", DogParams],
    queryFn: async () => api.post("/dogs", DogParams)
  });

  return { allDogs, ...rest };
};
