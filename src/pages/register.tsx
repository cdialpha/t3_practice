import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/user.schema";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
      router.push("/login");
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
        <br />
        <input type="text" placeholder="Jane" {...register("name")} />
        <button className="bg-slate-200 text-slate-800" type="submit">
          {" "}
          Register{" "}
        </button>
      </form>
      <Link href="/login"> Login </Link>
    </>
  );
};

export default RegisterPage;
