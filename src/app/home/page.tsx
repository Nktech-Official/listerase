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
  const userSession = sessionStorage.getItem("user");

  useEffect(() => {
    if (!user && !userSession) router.push("/");
  }, [router, user, userSession]);

  if (!user && !userSession) {
    router.push("/");
  }
  return (
    <div>
      <TodoForm user={user} />
      <TodoList user={user} />
    </div>
  );
}
