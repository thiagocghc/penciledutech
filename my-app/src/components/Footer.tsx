"use client";
import React from "react";
import { BsGithub, BsWhatsapp, BsLinkedin } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="mt-8 rounded-3xl overflow-hidden border border-gray-200 bg-white">
      {/* faixa superior verde */}
      <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />

      {/* Primeira linha: nome do projeto + redes sociais */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-6">
        {/* Texto à esquerda */}
        <p className="text-sm text-gray-600 text-center md:text-left">
          <span className="font-semibold text-gray-800">
            Pencil Edutech
          </span>{" "}
          — Questões de lógica e pensamento computacional.
        </p>

        {/* Redes sociais */}
        <div className="flex gap-6 justify-center">
          <a
            href="https://github.com/thiagocghc/Well_Classificador"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <BsGithub size={22} />
            <span className="mt-1 text-xs">GitHub</span>
          </a>
          <a
            href="https://wa.me/5567984026511"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <BsWhatsapp size={22} />
            <span className="mt-1 text-xs">WhatsApp</span>
          </a>
          <a
            href="https://www.linkedin.com/in/thiagoalmeida27/"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <BsLinkedin size={22} />
            <span className="mt-1 text-xs">LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Segunda linha: rodapé final */}
      <div className="w-full border-t border-gray-200 py-4 text-center">
        <p className="text-xs text-gray-500">
          Desenvolvido por{" "}
          <span className="font-semibold text-gray-700">@ThiagoAlmeida</span> • 2025
        </p>
      </div>
    </footer>
  );
}