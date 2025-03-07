"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/authservice";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login 📝
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
          />
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 w-full mb-4"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin text-gray-800" />
            ) : (
              "Login"
            )}
          </Button>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <p className="text-center text-gray-700">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-yellow-600 hover:text-yellow-700 cursor-pointer">
                Register
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
