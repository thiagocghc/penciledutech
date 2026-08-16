# Pencil Edutech

Aplicação mobile-first desenvolvida em Next.js + Tailwind CSS para exploração, filtragem, classificação e geração de questões de lógica, com foco no desenvolvimento do Pensamento Computacional.

A Pencil Edutech é uma startup de educação nascida a partir de uma pesquisa de mestrado, dedicada a apoiar professores e estudantes no ensino e no treino de raciocínio lógico e Pensamento Computacional, em alinhamento com a BNCC da Computação.

O objetivo principal é oferecer um acervo acessível de questões de lógica — reunindo os tipos mais frequentes de desafios computacionais — para fortalecer o ensino de Computação na educação básica, com apoio de Inteligência Artificial na classificação e na geração de novos exercícios.

---

## 🛠️ Tecnologias

- [Next.js 15 (App Router)](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://platform.openai.com/)

---

## Repositório do Projeto
```bash
git clone git@github.com:thiagocghc/Well_Classificador.git
```

## 📂 Estrutura
<pre lang="markdown"> ```
├── /app
│   ├── /classificar         → Página para classificar novas questões
│   ├── /gerar                → Página de geração assistida de questões
│   ├── /repositorio          → Página do repositório (questões sem classe)
│   ├── /sobre                 → Página sobre a Pencil Edutech
│   └── /api
│       ├── /classificar     → Endpoint para integração com OpenAI (classificação)
│       └── /gerar            → Endpoint para integração com OpenAI (geração)
│
├── /components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HomePage.tsx          → Página inicial
│   ├── SobrePage.tsx         → Página "Sobre"
│   ├── RepositorioPage.tsx  → Página do repositório
│   ├── GerarPage.tsx         → Página de geração de questões
│   ├── FilterBar.tsx / FilterBarRepo.tsx
│   ├── QuestionCard.tsx / QuestionCardRepo.tsx
│   ├── QuestionModal.tsx / QuestionModalRepo.tsx
│   ├── StudyTrailDrawer.tsx → Trilha de estudos
│   └── ui.tsx                 → Componentes reutilizáveis (botões, selects, inputs, etc.)
│
├── /hooks
│   ├── useCsvData.ts
│   └── useStudyTrail.ts
│
├── /lib
│   ├── csv.ts                  → Funções utilitárias para CSV
│   └── pdf.ts                  → Geração de PDF das trilhas de estudo
│
├── /types
│   └── questao.ts
│
├── /public
│   ├── logo.png                    → Ícone da Pencil Edutech
│   ├── logo_pencil_full.png  → Logo completa com nome
│   └── dataset(s) CSV
│
├── package.json
└── README.md

``` </pre>

## Dependências
NodeJS 22.20.0
npx create-next-app@latest myapp
npm install openai
npm install react-icons

## ENV
Você deve obter uma API KEY da OPENAI
OPENAI_API_KEY="sua_chave"
OPENAI_MODEL=gpt-5-mini

## Contato
Startup: Pencil Edutech
Autor: Thiago Almeida
GitHub: @thiagocghc
WhatsApp: 67 98402-6511
