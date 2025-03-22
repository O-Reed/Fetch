import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/axios";

export const useBreeds = () => {
  const { data: allBreeds } = useQuery({
    queryKey: ["breeds"],
    queryFn: (): Promise<string[]> => api.get("/dogs/breeds")
  });

  return { allBreeds };
};
