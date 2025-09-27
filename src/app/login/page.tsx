"use client";

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    password.length >= 6 && /\d/.test(password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // inline validation
    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email format",
      });
    }
    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 6 chars and contain a number",
        confirmPassword:
          form.confirmPassword && value !== form.confirmPassword
            ? "Passwords do not match"
            : "",
      });
    }
    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value === form.password ? "" : "Passwords do not match",
      });
    }
  };

  const isFormValid =
    validateEmail(form.email) &&
    validatePassword(form.password) &&
    form.password === form.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      alert("Login Successful!");
      setForm({ email: "", password: "", confirmPassword: "" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
        >
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
            </div>

            <div>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                </p>
                )}
            </div>

            <button
                type="submit"
                disabled={!isFormValid}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                Submit
            </button>
        </form>
    </main>
  );
}
