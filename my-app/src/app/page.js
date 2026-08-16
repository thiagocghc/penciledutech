import HomePage from "@/components/HomePage";

export default function Page() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-gray-50 to-white text-gray-900">
                  <div className="mx-auto w-full max-w-6xl px-2 py-5 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Questões de Lógica</h1>
          <p className="mt-1 text-sm text-gray-600"> Filtrar • Visualizar</p>
        </header>
                <HomePage />
      </div>
    </main>
  );
}