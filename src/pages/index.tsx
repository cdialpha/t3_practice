import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import styles from "../styles/Home.module.css";
import { useUserContext } from "../context/user.context";
import LoginForm from "../components/LoginForm";
import Link from "next/link";

const Home: NextPage = () => {
  const user = useUserContext();
  if (!user) {
    return <LoginForm />;
  }
  return (
    <div>
      <Link href="/posts/new"> Create a Post </Link>
    </div>
  );
};

export default Home;
