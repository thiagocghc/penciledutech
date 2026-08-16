export type Questao = {
  id: string | number;
  ano: string;
  nivel: string;
  fase: string;
  classe: string;
  titulo?: string;
  enunciado?: string;
  textoCompleto?: string;
};