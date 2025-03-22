import { useMutation } from "@tanstack/react-query";

import { api } from "@/config/axios";
import { MatchResponse } from "@/types";

export const useMatch = () => {
  return useMutation({
    mutationFn: async (dogIds: string[]) => {
      const response = await api.post<MatchResponse>("/dogs/match", dogIds);
      return response;
    }
  });
};
