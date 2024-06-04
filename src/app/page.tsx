"use client";
import SignIn from "@/components/SignIn";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");

    if (userSession) router.push("/home");
  });
  return (
    <main className="w-full min-h-screen">
      <SignIn />
    </main>
  );
}
