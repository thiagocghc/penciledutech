"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";

export default function SobrePage() {
  return (
    <div className="space-y-8">
      {/* HERO / GRID */}
      <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logo Pencil Edutech */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-center justify-center">
              <Image
                src="/logo_pencil_full.png"
                alt="Logo Pencil Edutech"
                width={220}
                height={220}
                className="h-auto w-auto"
                priority
              />
            </div>
          </div>

          {/* Texto central */}
          <div className="lg:col-span-6">

           <p className="text-justify mt-3 text-[15px] leading-relaxed text-gray-700">
              A Pencil Edutech é uma startup de educação nascida a partir de uma pesquisa de mestrado, dedicada a desenvolver o
              Pensamento Computacional e o raciocínio lógico de estudantes por meio de questões e atividades práticas.
            </p>

            <p className="text-justify mt-3 text-[15px] leading-relaxed text-gray-700">
              Nosso App disponibiliza um sistema de classificação automática de questões de lógica, explorando técnicas de
              Inteligência Artificial, além de um repositório digital com materiais de estudo organizados por tema e nível.
            </p>

              <p className="text-justify mt-3 text-[15px] leading-relaxed text-gray-700">
                Nossa proposta é disponibilizar para professores e estudantes um acervo acessível de questões de lógica, reunindo os
                tipos mais frequentes de desafios computacionais para apoiar o treino e o aprendizado de forma prática.
              </p>

              <p className="text-justify mt-3 text-[15px] leading-relaxed text-gray-700">
                Criado para apoiar quem ensina e quem aprende, aqui você pode explorar problemas de lógica, revisar questões de
                edições anteriores de competições de referência e desenvolver o Pensamento Computacional de um jeito simples e interativo.
              </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Explorar questões
              </Link>
              <Link
                href="/classificar"
                className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              >
                Classificar nova questão
              </Link>
            </div>
          </div>

          {/* Card lateral “Saiba mais” */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Saiba mais</h3>
              <ul className="mt-3 space-y-2 text-sm">
                                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br/prepare/estude/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Estude
                  </a>
                </li>
                                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br/pratique/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Pratique 
                  </a>
                </li>
                <li>
                  <a
                    href="https://olimpiada.ic.unicamp.br"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Site oficial da OBI
                  </a>
                </li>

                <li>
                  <a
                    href="http://wsmartins.net/jogosdelogica/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Divirta-se e Prepare-se
                  </a>
                </li>
               
              </ul>

           <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] leading-relaxed text-emerald-900">
                No repositório do nosso app você encontra um leque de questões de edições anteriores da OBI, com a possibilidade de filtrar por <b>ano</b>, <b>fase</b> e <b>nível</b>.
          </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
