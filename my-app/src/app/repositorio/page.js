// app/repositorio/page.tsx
import RepositorioPage from "@/components/RepositorioPage";

export default function Page() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">

      
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Repositório de Questões</h1>
          <p className="mt-1 text-sm text-gray-600">
            Questões extraídas do site da OBI que ainda não foram classificadas
          </p>
        </header>

                <RepositorioPage />
      </div>
    </main>
  );
}