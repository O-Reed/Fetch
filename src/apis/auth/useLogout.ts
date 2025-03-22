import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/config/axios";
import { queryClient } from "@/config/queryClient";

export const useLogout = () => {
  const navigate = useNavigate();

  const { mutate: logout, ...rest } = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
    },
    onSettled: () => {
      queryClient.clear();
      navigate("/auth/login", { replace: true });
    }
  });

  return { ...rest, logout };
};
