"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  progress: number;
  manager: string;
  worksCount: number;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Residencial Jardim das Flores",
    description: "Construção de condomínio residencial com 120 unidades",
    status: "IN_PROGRESS",
    startDate: "2024-01-15",
    endDate: "2024-12-30",
    budget: 2500000,
    actualCost: 1200000,
    progress: 48,
    manager: "João Silva",
    worksCount: 8
  },
  {
    id: 2,
    name: "Centro Comercial Plaza",
    description: "Construção de centro comercial com 50 lojas",
    status: "PLANNING",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    budget: 4200000,
    actualCost: 0,
    progress: 5,
    manager: "Maria Santos",
    worksCount: 3
  },
  {
    id: 3,
    name: "Galpão Industrial Norte",
    description: "Construção de galpão industrial de 5000m²",
    status: "IN_PROGRESS",
    startDate: "2023-10-01",
    endDate: "2024-06-30",
    budget: 1800000,
    actualCost: 1650000,
    progress: 92,
    manager: "Carlos Oliveira",
    worksCount: 5
  },
  {
    id: 4,
    name: "Reforma Hospital Central",
    description: "Reforma e ampliação do hospital central",
    status: "ON_HOLD",
    startDate: "2024-02-01",
    budget: 3500000,
    actualCost: 450000,
    progress: 12,
    manager: "Ana Costa",
    worksCount: 2
  }
];

const statusColors = {
  PLANNING: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800"
};

const statusLabels = {
  PLANNING: "Planejamento",
  IN_PROGRESS: "Em Andamento",
  ON_HOLD: "Pausado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado"
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // New project form state
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    manager: ""
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      const projectData = {
        id: projects.length + 1,
        name: newProject.name,
        description: newProject.description,
        status: "PLANNING" as const,
        startDate: newProject.startDate,
        endDate: newProject.endDate || undefined,
        budget: newProject.budget ? parseFloat(newProject.budget) : undefined,
        actualCost: 0,
        progress: 0,
        manager: newProject.manager,
        worksCount: 0
      };

      setProjects([...projects, projectData]);
      setIsDialogOpen(false);
      setNewProject({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        budget: "",
        manager: ""
      });

      toast.success("Projeto criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar projeto. Tente novamente.");
    }
  };

  const calculateProgress = (project: Project) => {
    if (project.status === "COMPLETED") return 100;
    if (project.status === "CANCELLED") return 0;
    return project.progress;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Projetos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os projetos da empresa
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Novo Projeto</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
                <DialogDescription>
                  Preencha as informações básicas do projeto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Projeto</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Nome do projeto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Descrição do projeto"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Gerente do Projeto</Label>
                  <Input
                    id="manager"
                    value={newProject.manager}
                    onChange={(e) => setNewProject({...newProject, manager: e.target.value})}
                    placeholder="Nome do gerente"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Projeto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="PLANNING">Planejamento</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="ON_HOLD">Pausado</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={statusColors[project.status]}>
                    {statusLabels[project.status]}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{calculateProgress(project)}%</span>
                    </div>
                    <Progress value={calculateProgress(project)} className="h-2" />
                  </div>

                  {/* Project Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gerente:</span>
                      <span className="font-medium">{project.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Obras:</span>
                      <span className="font-medium">{project.worksCount}</span>
                    </div>
                    {project.budget && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orçamento:</span>
                        <span className="font-medium">
                          R$ {(project.budget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    )}
                    {project.actualCost && project.actualCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gasto:</span>
                        <span className="font-medium">
                          R$ {(project.actualCost / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="pt-2 border-t text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                      {project.endDate && (
                        <span>Fim: {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum projeto encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              Tente ajustar os filtros ou criar um novo projeto
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
