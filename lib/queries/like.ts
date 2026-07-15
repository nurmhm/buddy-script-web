import { api } from "../api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

type ToggleLikePayload = {
  targetType: "POST" | "COMMENT";
  targetId: string;
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ToggleLikePayload) => {
      const { data } = await api.post("/likes/toggle", payload);
      return data.data as { liked: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments });
      queryClient.invalidateQueries({ queryKey: queryKeys.replies });
    },
  });
};
