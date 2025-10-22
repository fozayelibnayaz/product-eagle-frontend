import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../store/slices/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useRouter } from "next/router";
import "./login.css"; // Add this line

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
    <div className="login-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="glass-box">
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <input
          {...register("username")}
          placeholder="Email"
          className="login-input"
        />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="login-input"
        />
        <button type="submit" disabled={isLoading} className="login-btn">
          Sign in
        </button>
        <div className="login-divider">or</div>
        <button type="button" className="oauth-btn google">
          <span className="oauth-icon g" />
          Continue with Google
        </button>
        <button type="button" className="oauth-btn x">
          <span className="oauth-icon x" />
          Continue with X
        </button>
        <p className="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </form>
    </div>
  );
}
