import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, setAccessToken } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { TLoginSchema, TRegisterSchema } from "../schema/auth.schema";

export function useRegister() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (payload: TRegisterSchema) => api.post("/auth/register", payload),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      setAccessToken(accessToken);
      setUser(user);
      router.push("/");
    },
  });
}


export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (payload: TLoginSchema) => api.post("/auth/login", payload),
    onSuccess: (res) => {
      const { user, accessToken } = res.data.data;
      setAccessToken(accessToken);   
      setUser(user);                 
      router.push("/");
    },
  });
}