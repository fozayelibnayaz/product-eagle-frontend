import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../store/slices/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useRouter } from "next/router";

type FormData = { username: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      const res = await login(data).unwrap();
      dispatch(setUser({ username: res.username }));
      router.push("/products");
    } catch (err) {
      alert("Invalid credentials. Use demo@eagle.com / DemoPassword123");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <label className="block mb-2">Email</label>
        <input {...register("username")} defaultValue="name@mail.com" className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Password</label>
        <input {...register("password")} defaultValue="12345" type="password" className="w-full p-2 border rounded mb-3" />
        <button type="submit" disabled={isLoading} className="w-full p-2 bg-blue-600 text-white rounded">Sign in</button>
      </form>
    </div>
  );
}
