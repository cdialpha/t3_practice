import React from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import { trpc } from "../../utils/trpc";

const SinglePostPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const { data, isLoading } = trpc.useQuery(["posts.single-post", { postId }]);

  if (isLoading) {
    return <p> Loading post ... </p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.body}</p>
    </div>
  );
};

export default SinglePostPage;
