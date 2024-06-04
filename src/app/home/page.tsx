"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");

    if (!user && !userSession) router.push("/");
  }, [router, user]);

  return (
    <div>
      <TodoForm user={user} />
      <TodoList user={user} />
    </div>
  );
}
