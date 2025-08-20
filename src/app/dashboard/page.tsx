"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Mock data for demonstration
const mockFinancialData = [
  { name: "Jan", receita: 450000, custo: 320000 },
  { name: "Fev", receita: 520000, custo: 380000 },
  { name: "Mar", receita: 480000, custo: 350000 },
  { name: "Abr", receita: 600000, custo: 420000 },
  { name: "Mai", receita: 580000, custo: 410000 },
  { name: "Jun", receita: 650000, custo: 450000 },
];

const mockProjectStatus = [
  { name: "Planejamento", value: 3, color: "#8884d8" },
  { name: "Em Andamento", value: 8, color: "#82ca9d" },
  { name: "Pausado", value: 2, color: "#ffc658" },
  { name: "Concluído", value: 12, color: "#ff7300" },
];

const mockWorkProgress = [
  { name: "Obra A - Residencial", progress: 85, status: "Em Andamento" },
  { name: "Obra B - Comercial", progress: 45, status: "Em Andamento" },
  { name: "Obra C - Industrial", progress: 92, status: "Finalizando" },
  { name: "Obra D - Residencial", progress: 15, status: "Iniciando" },
];

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState({
    totalProjects: 25,
    activeWorks: 8,
    totalRevenue: 3280000,
    monthlyGrowth: 12.5,
    employeeCount: 145,
    machineryActive: 23,
    pendingDocuments: 7,
    qualityScore: 94.2
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Gestão</h1>
          <p className="text-gray-600 mt-2">
            Visão geral dos projetos, obras e indicadores da empresa
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Projetos</CardDescription>
              <CardTitle className="text-2xl">{kpiData.totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Obras Ativas</CardDescription>
              <CardTitle className="text-2xl">{kpiData.activeWorks}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                6 em andamento normal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl">
                R$ {(kpiData.totalRevenue / 1000000).toFixed(1)}M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600">
                +{kpiData.monthlyGrowth}% este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Funcionários</CardDescription>
              <CardTitle className="text-2xl">{kpiData.employeeCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {kpiData.machineryActive} equipamentos ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Financeiro</CardTitle>
              <CardDescription>
                Receita vs Custos nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockFinancialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [
                      `R$ ${(value / 1000).toFixed(0)}k`,
                      value === mockFinancialData[0]?.receita ? "Receita" : "Custo"
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Receita"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="custo" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Custo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Projetos</CardTitle>
              <CardDescription>
                Distribuição atual dos projetos por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockProjectStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockProjectStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Work Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso das Obras</CardTitle>
            <CardDescription>
              Acompanhamento do andamento das principais obras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkProgress.map((work, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{work.name}</p>
                      <p className="text-xs text-gray-500">{work.status}</p>
                    </div>
                    <span className="text-sm font-medium">{work.progress}%</span>
                  </div>
                  <Progress value={work.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {kpiData.pendingDocuments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção imediata
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score de Qualidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {kpiData.qualityScore}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média das últimas inspeções
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {kpiData.machineryActive}/28
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Equipamentos em operação
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
