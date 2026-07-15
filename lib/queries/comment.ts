import { api } from "../api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

export type TComment = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    replies: number;
  };
};

type CreateCommentPayload = {
  postId: string;
  content: string;
  parentId?: string;
};

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: [...queryKeys.comments, postId],
    queryFn: async () => {
      const { data } = await api.get("/comments", {
        params: { postId, page: 1, limit: 50, sortBy: "createdAt", orderBy: "desc" },
      });
      return data.data as TComment[];
    },
    enabled: !!postId,
  });
};

export const useGetReplies = (commentId: string) => {
  return useQuery({
    queryKey: [...queryKeys.replies, commentId],
    queryFn: async () => {
      const { data } = await api.get(`/comments/${commentId}/replies`, {
        params: { page: 1, limit: 50, sortBy: "createdAt", orderBy: "asc" },
      });
      return data.data as TComment[];
    },
    enabled: !!commentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const { data } = await api.post("/comments", payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.comments, variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts,
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.replies, variables.parentId],
        });
      }
    },
  });
};
