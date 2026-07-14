import { api } from "../api-client";
import { useQuery } from "@tanstack/react-query";
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
