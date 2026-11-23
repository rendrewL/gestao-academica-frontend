
import type { Item, ItemPayload, Recurso } from "@/types/item";

const API_URL = import.meta.env.VITE_API_URL;

async function requisicao<T>(
  caminho: string,
  opcoes?: RequestInit,
): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...opcoes?.headers,
    },
  });

  if (!resposta.ok) {
    let mensagem = `Erro HTTP ${resposta.status}`;

    try {
      const dados: { erro?: string } = await resposta.json();
      mensagem = dados.erro ?? mensagem;
    } catch {
      // Mantém a mensagem HTTP quando não há JSON.
    }

    throw new Error(mensagem);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return resposta.json() as Promise<T>;
}

export const api = {
  listar(recurso: Recurso): Promise<Item[]> {
    return requisicao<Item[]>(`/${recurso}`);
  },

  criar(recurso: Recurso, dados: ItemPayload): Promise<Item> {
    return requisicao<Item>(`/${recurso}`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },

  atualizar(
    recurso: Recurso,
    id: number,
    dados: ItemPayload,
  ): Promise<Item> {
    return requisicao<Item>(`/${recurso}/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
  },

  excluir(recurso: Recurso, id: number): Promise<void> {
    return requisicao<void>(`/${recurso}/${id}`, {
      method: "DELETE",
    });
  },
};
