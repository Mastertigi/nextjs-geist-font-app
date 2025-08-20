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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Work {
  id: number;
  name: string;
  description: string;
  location: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  progress: number;
  plannedCost?: number;
  actualCost?: number;
  startDate?: string;
  endDate?: string;
  projectName: string;
  assignee: string;
  qualityScore?: number;
  lastUpdate: string;
}

const mockWorks: Work[] = [
  {
    id: 1,
    name: "Fundação Bloco A",
    description: "Execução da fundação do bloco residencial A",
    location: "Jardim das Flores - Quadra 1",
    status: "COMPLETED",
    progress: 100,
    plannedCost: 180000,
    actualCost: 175000,
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    projectName: "Residencial Jardim das Flores",
    assignee: "Equipe Alpha",
    qualityScore: 95,
    lastUpdate: "2024-02-28"
  },
  {
    id: 2,
    name: "Estrutura Bloco B",
    description: "Construção da estrutura de concreto armado",
    location: "Jardim das Flores - Quadra 2",
    status: "IN_PROGRESS",
    progress: 65,
    plannedCost: 320000,
    actualCost: 210000,
    startDate: "2024-02-01",
    endDate: "2024-05-30",
    projectName: "Residencial Jardim das Flores",
    assignee: "Equipe Beta",
    qualityScore: 88,
    lastUpdate: "2024-03-15"
  },
  {
    id: 3,
    name: "Instalações Elétricas",
    description: "Instalação do sistema elétrico completo",
    location: "Centro Comercial Plaza",
    status: "NOT_STARTED",
    progress: 0,
    plannedCost: 450000,
    actualCost: 0,
    startDate: "2024-04-01",
    endDate: "2024-07-15",
    projectName: "Centro Comercial Plaza",
    assignee: "Equipe Gamma",
    lastUpdate: "2024-03-01"
  },
  {
    id: 4,
    name: "Cobertura Industrial",
    description: "Instalação da cobertura metálica do galpão",
    location: "Galpão Industrial Norte",
    status: "IN_PROGRESS",
    progress: 85,
    plannedCost: 280000,
    actualCost: 265000,
    startDate: "2024-01-10",
    endDate: "2024-04-30",
    projectName: "Galpão Industrial Norte",
    assignee: "Equipe Delta",
    qualityScore: 92,
    lastUpdate: "2024-03-20"
  },
  {
    id: 5,
    name: "Reforma Ala Norte",
    description: "Reforma completa da ala norte do hospital",
    location: "Hospital Central",
    status: "ON_HOLD",
    progress: 25,
    plannedCost: 680000,
    actualCost: 170000,
    startDate: "2024-02-01",
    projectName: "Reforma Hospital Central",
    assignee: "Equipe Epsilon",
    qualityScore: 78,
    lastUpdate: "2024-03-10"
  }
];

const statusColors = {
  NOT_STARTED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
};

const statusLabels = {
  NOT_STARTED: "Não Iniciado",
  IN_PROGRESS: "Em Andamento",
  ON_HOLD: "Pausado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado"
};

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>(mockWorks);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");

  // New work form state
  const [newWork, setNewWork] = useState({
    name: "",
    description: "",
    location: "",
    plannedCost: "",
    startDate: "",
    endDate: "",
    projectName: "",
    assignee: ""
  });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || work.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateWork = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const workData = {
        id: works.length + 1,
        name: newWork.name,
        description: newWork.description,
        location: newWork.location,
        status: "NOT_STARTED" as const,
        progress: 0,
        plannedCost: newWork.plannedCost ? parseFloat(newWork.plannedCost) : undefined,
        actualCost: 0,
        startDate: newWork.startDate || undefined,
        endDate: newWork.endDate || undefined,
        projectName: newWork.projectName,
        assignee: newWork.assignee,
        lastUpdate: new Date().toISOString().split('T')[0]
      };

      setWorks([...works, workData]);
      setIsDialogOpen(false);
      setNewWork({
        name: "",
        description: "",
        location: "",
        plannedCost: "",
        startDate: "",
        endDate: "",
        projectName: "",
        assignee: ""
      });

      toast.success("Obra criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar obra. Tente novamente.");
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === "COMPLETED") return "bg-green-500";
    if (status === "ON_HOLD") return "bg-yellow-500";
    if (status === "CANCELLED") return "bg-red-500";
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getQualityColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
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
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Obras</h1>
            <p className="text-gray-600 mt-2">
              Acompanhe o progresso e status de todas as obras
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nova Obra</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Obra</DialogTitle>
                <DialogDescription>
                  Cadastre uma nova obra no sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateWork} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Obra</Label>
                  <Input
                    id="name"
                    value={newWork.name}
                    onChange={(e) => setNewWork({...newWork, name: e.target.value})}
                    placeholder="Nome da obra"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newWork.description}
                    onChange={(e) => setNewWork({...newWork, description: e.target.value})}
                    placeholder="Descrição da obra"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={newWork.location}
                    onChange={(e) => setNewWork({...newWork, location: e.target.value})}
                    placeholder="Endereço ou localização"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Projeto</Label>
                  <Input
                    id="projectName"
                    value={newWork.projectName}
                    onChange={(e) => setNewWork({...newWork, projectName: e.target.value})}
                    placeholder="Nome do projeto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Equipe Responsável</Label>
                  <Input
                    id="assignee"
                    value={newWork.assignee}
                    onChange={(e) => setNewWork({...newWork, assignee: e.target.value})}
                    placeholder="Nome da equipe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newWork.startDate}
                      onChange={(e) => setNewWork({...newWork, startDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newWork.endDate}
                      onChange={(e) => setNewWork({...newWork, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plannedCost">Custo Planejado (R$)</Label>
                  <Input
                    id="plannedCost"
                    type="number"
                    value={newWork.plannedCost}
                    onChange={(e) => setNewWork({...newWork, plannedCost: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Obra
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
              placeholder="Buscar obras..."
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
              <SelectItem value="NOT_STARTED">Não Iniciado</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="ON_HOLD">Pausado</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Obras</TabsTrigger>
            <TabsTrigger value="kanban">Quadro Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Works Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <Card key={work.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{work.name}</CardTitle>
                      <Badge className={statusColors[work.status]}>
                        {statusLabels[work.status]}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {work.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progresso</span>
                          <span>{work.progress}%</span>
                        </div>
                        <Progress 
                          value={work.progress} 
                          className="h-2"
                        />
                      </div>

                      {/* Work Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Projeto:</span>
                          <span className="font-medium text-right text-xs">
                            {work.projectName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipe:</span>
                          <span className="font-medium">{work.assignee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Local:</span>
                          <span className="font-medium text-right text-xs">
                            {work.location}
                          </span>
                        </div>
                        {work.qualityScore && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Qualidade:</span>
                            <span className={`font-medium ${getQualityColor(work.qualityScore)}`}>
                              {work.qualityScore}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Costs */}
                      {work.plannedCost && (
                        <div className="space-y-2 text-sm border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Planejado:</span>
                            <span className="font-medium">
                              R$ {(work.plannedCost / 1000).toFixed(0)}k
                            </span>
                          </div>
                          {work.actualCost && work.actualCost > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gasto:</span>
                              <span className="font-medium">
                                R$ {(work.actualCost / 1000).toFixed(0)}k
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Dates */}
                      <div className="text-xs text-gray-500 border-t pt-2">
                        {work.startDate && (
                          <div className="flex justify-between">
                            <span>Início: {new Date(work.startDate).toLocaleDateString('pt-BR')}</span>
                            {work.endDate && (
                              <span>Fim: {new Date(work.endDate).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        )}
                        <div className="mt-1">
                          Atualizado: {new Date(work.lastUpdate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Atualizar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.entries(statusLabels).map(([status, label]) => (
                <div key={status} className="space-y-4">
                  <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                    {label}
                  </h3>
                  <div className="space-y-3">
                    {filteredWorks
                      .filter(work => work.status === status)
                      .map(work => (
                        <Card key={work.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">{work.name}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {work.description}
                            </p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">{work.assignee}</span>
                              <span className="font-medium">{work.progress}%</span>
                            </div>
                            <Progress value={work.progress} className="h-1" />
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma obra encontrada</p>
            <p className="text-gray-400 text-sm mt-2">
              Tente ajustar os filtros ou criar uma nova obra
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
