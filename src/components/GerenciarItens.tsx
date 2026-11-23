import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AlertCircle, BookOpen, Pencil, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { Item, Recurso } from "@/types/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Props = { recurso: Recurso };

export function GerenciarItens({ recurso }: Props) {
  const aluno = recurso === "alunos";
  const titulo = aluno ? "Alunos" : "Disciplinas";
  const singular = aluno ? "aluno" : "disciplina";
  const Icone = aluno ? Users : BookOpen;
  const [itens, setItens] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState<Item | null>(null);
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [itemExcluindo, setItemExcluindo] = useState<Item | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setItens(await api.listar(recurso));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar os registros.");
    } finally {
      setCarregando(false);
    }
  }, [recurso]);

  useEffect(() => { void carregar(); }, [carregar]);

  function novo() {
    setItemEditando(null);
    setNome("");
    setModalAberto(true);
  }

  function editar(item: Item) {
    setItemEditando(item);
    setNome(item.nome);
    setModalAberto(true);
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const valor = nome.trim();
    if (!valor || valor.length > 120) {
      toast.error("Informe um nome de 1 a 120 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      if (itemEditando) {
        const atualizado = await api.atualizar(recurso, itemEditando.id, { nome: valor });
        setItens(anteriores => anteriores.map(item => item.id === atualizado.id ? atualizado : item));
        toast.success(`${aluno ? "Aluno atualizado" : "Disciplina atualizada"} com sucesso!`);
      } else {
        const criado = await api.criar(recurso, { nome: valor });
        setItens(anteriores => [...anteriores, criado]);
        toast.success(`${aluno ? "Aluno cadastrado" : "Disciplina cadastrada"} com sucesso!`);
      }
      setModalAberto(false);
      setItemEditando(null);
      setNome("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!itemExcluindo) return;
    setExcluindo(true);
    try {
      await api.excluir(recurso, itemExcluindo.id);
      setItens(anteriores => anteriores.filter(item => item.id !== itemExcluindo.id));
      setItemExcluindo(null);
      toast.success(`${aluno ? "Aluno excluído" : "Disciplina excluída"} com sucesso!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">{titulo}</h2>
          <p className="mt-1 text-muted-foreground">Gerencie {aluno ? "os alunos cadastrados" : "as disciplinas cadastradas"} no sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void carregar()} disabled={carregando}>
            <RefreshCw className={carregando ? "animate-spin" : ""} /> Atualizar
          </Button>
          <Button onClick={novo}><Plus /> {aluno ? "Novo aluno" : "Nova disciplina"}</Button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Icone className="size-5" /> {titulo} cadastrados <Badge variant="secondary">{itens.length}</Badge></CardTitle></CardHeader>
        <CardContent>
          {carregando ? (
            <div role="status" className="py-12 text-center text-muted-foreground"><RefreshCw className="mx-auto mb-3 animate-spin" />Carregando...</div>
          ) : erro ? (
            <div role="alert" className="flex flex-col items-center gap-3 py-12"><AlertCircle className="size-8 text-destructive" /><p className="text-destructive">{erro}</p><Button variant="outline" onClick={() => void carregar()}>Tentar novamente</Button></div>
          ) : itens.length === 0 ? (
            <div className="py-12 text-center"><Icone className="mx-auto mb-3 size-10 text-muted-foreground" /><p className="font-medium">Nenhum registro cadastrado</p><p className="text-sm text-muted-foreground">Clique em {aluno ? "Novo aluno" : "Nova disciplina"} para começar.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                <TableBody>{itens.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">#{item.id}</TableCell>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell><Badge variant="outline">Cadastrado</Badge></TableCell>
                    <TableCell><div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => editar(item)} aria-label={`Editar ${item.nome}`}><Pencil className="size-4" /> Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => setItemExcluindo(item)} aria-label={`Excluir ${item.nome}`}><Trash2 className="size-4" /> Excluir</Button>
                    </div></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={aberto => { if (!salvando) setModalAberto(aberto); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{itemEditando ? `Editar ${singular}` : aluno ? "Cadastrar aluno" : "Cadastrar disciplina"}</DialogTitle><DialogDescription>Informe o nome para {itemEditando ? "atualizar" : "cadastrar"} o registro.</DialogDescription></DialogHeader>
          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome-item">Nome</Label><Input id="nome-item" autoFocus value={nome} onChange={e => setNome(e.target.value)} maxLength={120} required placeholder={aluno ? "Nome completo" : "Nome da disciplina"} /></div>
            <DialogFooter><Button type="button" variant="outline" disabled={salvando} onClick={() => setModalAberto(false)}>Cancelar</Button><Button type="submit" disabled={salvando}>{salvando ? "Salvando..." : itemEditando ? "Salvar alterações" : "Cadastrar"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={itemExcluindo !== null} onOpenChange={aberto => { if (!aberto && !excluindo) setItemExcluindo(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar exclusão</DialogTitle><DialogDescription>Deseja excluir {singular === "aluno" ? "o aluno" : "a disciplina"} <strong>{itemExcluindo?.nome}</strong>? Esta ação não pode ser desfeita.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" disabled={excluindo} onClick={() => setItemExcluindo(null)}>Cancelar</Button><Button variant="destructive" disabled={excluindo} onClick={() => void confirmarExclusao()}>{excluindo ? "Excluindo..." : "Excluir definitivamente"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
