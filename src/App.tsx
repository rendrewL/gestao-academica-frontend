
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Alunos } from "@/pages/Alunos";
import { Disciplinas } from "@/pages/Disciplinas";

import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/disciplinas" element={<Disciplinas />} />
        </Route>
      </Routes>

      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
