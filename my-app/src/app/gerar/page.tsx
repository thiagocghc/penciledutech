import GerarPage from "@/components/GerarPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerar Questões | Pencil Edutech",
  description: "Geração assistida de questões da OBI com base no dataset rotulado.",
};

export default function Page() {
  return <GerarPage />;
}
