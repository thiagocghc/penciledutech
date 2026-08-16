"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/classificar", label: "Classificar" },
  { href: "/gerar", label: "Gerar Questões", highlight: true },
  { href: "/repositorio", label: "Repositório" },
  { href: "/sobre", label: "Sobre" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="sticky top-0 z-[100] isolate border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Pencil Edutech" width={54} height={54} priority />
          <div className="hidden sm:block">
            <span className="block text-[1.05rem] font-bold tracking-tight text-gray-800">
              Pencil Edutech
            </span>
            <span className="block text-xs text-gray-500">Pensamento Computacional e Lógico</span>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navItems.map((it) => {
            const active = isActive(it.href);
            const highlight = Boolean(it.highlight);

            return (
              <Link
                key={it.href}
                href={it.href}
                className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                  highlight
                    ? active
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : active
                    ? "text-emerald-700"
                    : "text-gray-700 hover:text-emerald-700"
                }`}
              >
                {highlight && <LuBrainCircuit className="text-base" />}
                {it.label}
                {!highlight && (
                  <span
                    className={`pointer-events-none absolute bottom-0 left-3 right-3 h-[2px] origin-left transform transition-transform duration-200 ${
                      active ? "scale-x-100 bg-emerald-500" : "scale-x-0 bg-emerald-400 group-hover:scale-x-100"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

      <div className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="border-b border-gray-100 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            {navItems.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={`w-full rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-50 text-emerald-700"
                      : it.highlight
                      ? "bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {it.highlight && <LuBrainCircuit className="text-base" />}
                    {it.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
