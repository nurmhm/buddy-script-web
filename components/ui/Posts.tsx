"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useGetPosts } from "@/lib/queries/post";
import PostCard, { TPost } from "./PostCard";

const Posts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetPosts();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>{(error as Error).message}</div>;
  }

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((post: TPost) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      <div ref={ref} style={{ height: 20 }} />

      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading more...
        </div>
      )}

      {!hasNextPage && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No more posts
        </div>
      )}
    </div>
  );
};

export default Posts;