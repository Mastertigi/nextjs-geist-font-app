"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  {
    title: "Painel Principal",
    href: "/dashboard",
    description: "Visão geral e indicadores"
  },
  {
    title: "Projetos",
    href: "/projetos",
    description: "Gestão de projetos"
  },
  {
    title: "Obras",
    href: "/obras",
    description: "Acompanhamento de obras"
  },
  {
    title: "Estoque",
    href: "/estoque",
    description: "Controle de materiais"
  },
  {
    title: "Maquinário",
    href: "/maquinario",
    description: "Equipamentos e manutenção"
  },
  {
    title: "Funcionários",
    href: "/funcionarios",
    description: "Gestão de pessoal"
  },
  {
    title: "Documentos",
    href: "/documentos",
    description: "Arquivos e contratos"
  },
  {
    title: "Qualidade",
    href: "/qualidade",
    description: "Controle de qualidade"
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    description: "Análises e relatórios"
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Gestão de Obras
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Sistema Integrado
        </p>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="p-4 border-b border-gray-200">
          <Card className="p-3">
            <p className="font-medium text-sm text-gray-900">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-600">
              {session.user.email}
            </p>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="font-medium text-sm">
                {item.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.description}
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleLogout}
        >
          Sair do Sistema
        </Button>
      </div>
    </div>
  );
}
