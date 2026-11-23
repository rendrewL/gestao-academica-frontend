# Gestão Acadêmica — AT2 LDW

Frontend SPA com **React, TypeScript, Vite, Tailwind CSS e shadcn/ui**, consumindo a API REST Node.js/Express/PostgreSQL desenvolvida na atividade IEC.

## Funcionalidades
- Dashboard com total de alunos e disciplinas retornados pela API.
- CRUD completo (GET, POST, PUT e DELETE) de alunos e disciplinas.
- Formulários em Dialog, confirmação antes de excluir e notificações Sonner.
- Indicadores de carregamento, estado vazio, erros e layout responsivo.
- Navegação SPA com React Router DOM.

## Requisitos
Node.js 20.19+ ou 22.12+ (compatível com Vite 8) e npm.

## Como executar
```bash
npm install
cp .env.example .env
npm run dev
```
No Windows PowerShell, use `Copy-Item .env.example .env` se o `.env` não existir.
Acesse `http://localhost:5173`.

## Verificar build
```bash
npm run build
npm run preview
```

## API
- URL: https://fatec-at2-iec.onrender.com
- Health check: https://fatec-at2-iec.onrender.com/api/health
- Endpoints: `/alunos`, `/disciplinas` e `/:recurso/:id` (GET, POST, PUT, DELETE conforme operação).
- Configure `VITE_API_URL` no `.env`. **Não inclua credenciais de banco de dados no frontend.**
- A API permite origem `http://localhost:5173` via CORS. Para hospedar o frontend, configure `FRONTEND_URL` no backend com a nova origem.

## Vídeo de demonstração (até 3 minutos)
Mostre o frontend e a API em execução, cadastro, edição e exclusão de um registro, toasts, e a aba Network do navegador com GET, POST, PUT e DELETE bem-sucedidos. Adicione o link público do vídeo na entrega acadêmica.
