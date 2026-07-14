import { api } from "../api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";



export const getPosts = async () => {
  const res = await api.get("/posts");

  return res.data;
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: getPosts,
  });
};

type CreatePostPayload = {
  content: string;
  visibility: "PUBLIC" | "PRIVATE";
  image?: File | null;
};
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const formData = new FormData();

      formData.append("content", payload.content);
      formData.append("visibility", payload.visibility);

      if (payload.image) {
        formData.append("image", payload.image);
      }

      const { data } = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
    },
  });
};
