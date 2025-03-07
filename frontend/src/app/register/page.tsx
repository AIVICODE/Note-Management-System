"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Username already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Register 📝
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Register"
            )}
          </Button>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <p className="text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-yellow-600 hover:text-yellow-700 cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
