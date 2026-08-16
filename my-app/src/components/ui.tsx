"use client";

import React from "react";

type BaseClassName = { className?: string };

export function Badge({ children, className = "" }: { children: React.ReactNode } & BaseClassName) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700 border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </span>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 ${className}`}
    />
  );
}

export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-gray-300 ${className}`}
    >
      {children}
    </select>
  );
}

export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      : variant === "ghost"
      ? "bg-transparent hover:bg-gray-100 text-gray-700"
      : "bg-emerald-700 text-white hover:bg-emerald-800 disabled:bg-emerald-400";

  return (
    <button
      {...props}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
