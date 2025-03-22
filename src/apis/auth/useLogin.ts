import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { api } from "@/config/axios";
import { LoginRequest } from "@/types";

export const useLogin = () => {
  const navigate = useNavigate();
 
  const { mutate: login, ...rest } = useMutation({
    mutationFn: async (data: LoginRequest) => {
      await api.post("/auth/login", data);
      localStorage.setItem("user", JSON.stringify(data));
    },
    onSuccess: () => {
      navigate("/search");
    },
    onError: err => {
      console.log(err?.message || "Invalid Email or Password");
    }
  });

  return {login, ...rest };
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}