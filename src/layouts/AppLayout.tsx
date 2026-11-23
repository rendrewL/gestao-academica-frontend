
import { NavLink, Outlet } from "react-router-dom";
import { GraduationCap, LayoutDashboard, Users, BookOpen } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alunos", label: "Alunos", icon: Users },
  { to: "/disciplinas", label: "Disciplinas", icon: BookOpen },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="border-b bg-card md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 border-b p-5">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-bold">Gestão Acadêmica</h1>
            <p className="text-xs text-muted-foreground">
              Painel administrativo
            </p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center border-b bg-card px-6">
          <span className="font-semibold">Sistema de Gestão Acadêmica</span>
        </header>

        <main className="mx-auto max-w-7xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
