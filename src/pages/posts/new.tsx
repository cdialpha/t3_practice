import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

const CreatePostPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreatePostInput>();

  const { mutate, error } = trpc.useMutation(["posts.create-post"], {
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
    },
  });

  const onSubmit = (values: CreatePostInput) => {
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1> Create Post </h1>
      <input type="text" placeholder="Your post title" {...register("title")} />

      <textarea placeholder="Your post body" {...register("body")} />
      <button> Create Post </button>
    </form>
  );
};

export default CreatePostPage;
