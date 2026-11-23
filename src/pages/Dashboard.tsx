import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, RefreshCw, Users } from "lucide-react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [alunos, setAlunos] = useState<number | null>(null);
  const [disciplinas, setDisciplinas] = useState<number | null>(null);
  const [erro, setErro] = useState(false);
  const [atualizacao, setAtualizacao] = useState(0);
  useEffect(() => {
    let ativo = true;
    Promise.all([api.listar("alunos"), api.listar("disciplinas")])
      .then(([listaAlunos, listaDisciplinas]) => {
        if (ativo) { setAlunos(listaAlunos.length); setDisciplinas(listaDisciplinas.length); setErro(false); }
      })
      .catch(() => { if (ativo) setErro(true); });
    return () => { ativo = false; };
  }, [atualizacao]);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h2 className="text-3xl font-bold">Dashboard</h2><p className="text-muted-foreground">Visão geral dos dados acadêmicos em tempo real.</p></div>
        <Button variant="outline" onClick={() => setAtualizacao(n => n + 1)}><RefreshCw /> Atualizar</Button>
      </div>
      {erro && <p role="alert" className="text-destructive">Não foi possível consultar a API. Tente atualizar novamente.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/alunos"><Card className="h-full transition-shadow hover:shadow-md"><CardHeader><CardTitle className="flex items-center gap-2"><Users className="size-5" /> Alunos</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{alunos ?? "—"}</p><p className="mt-2 text-sm text-muted-foreground">Alunos cadastrados · Gerenciar alunos</p></CardContent></Card></Link>
        <Link to="/disciplinas"><Card className="h-full transition-shadow hover:shadow-md"><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="size-5" /> Disciplinas</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{disciplinas ?? "—"}</p><p className="mt-2 text-sm text-muted-foreground">Disciplinas cadastradas · Gerenciar disciplinas</p></CardContent></Card></Link>
      </div>
    </div>
  );
}
