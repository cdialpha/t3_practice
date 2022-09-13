import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/user.schema";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
