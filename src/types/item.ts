
export interface Item {
  id: number;
  nome: string;
}

export interface ItemPayload {
  nome: string;
}

export type Recurso = "alunos" | "disciplinas";
