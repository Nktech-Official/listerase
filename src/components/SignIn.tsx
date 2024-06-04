"use client";
import { useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{
    status: boolean;
    message: string | null;
  }>({ status: false, message: null });
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleAuth = async (mode: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({
        status: true,
        message: "Invalid email address. Please enter a valid email.",
      });
      return; // Exit early if email is invalid
    }

    // Validate password length
    if (password.length < 6) {
      setError({
        status: true,
        message: "Password must be at least 6 characters long.",
      });
      return; // Exit early if password is too short
    }
    if (email !== "" || password !== "") {
      try {
        let res;
        if (mode === "login") {
          res = await signInWithEmailAndPassword(email, password);
          console.log(res);
        } else if (mode === "new") {
          res = await createUserWithEmailAndPassword(email, password);
          console.log(res);
        }
        if (res) {
          sessionStorage.setItem("user", "true");
          setEmail("");
          setPassword("");
          router.push("/home");
        } else {
          setError({
            status: true,
            message: "Login Failed (user may not exisit)",
          });
          console.error("Login Failed...");
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setError({
        status: true,
        message: "Email and Password is Required to Authenticate.",
      });
      console.log("email and password cannot be empty");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl mb-5">Sign In</h1>
        {error.status && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-md font-medium text-sm">
            {error.message}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4  rounded outline-none border "
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded outline-none border"
        />
        <button
          onClick={() => handleAuth("login")}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Log In
        </button>
        <button
          onClick={() => {
            handleAuth("new");
          }}
          className="w-full mt-4 p-3 bg-slate-600 rounded text-white hover:bg-slate-500"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;
