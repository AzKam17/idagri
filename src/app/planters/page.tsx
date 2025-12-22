'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, CreditCard, Scale, FileText } from 'lucide-react';
import PlanterForm from '@/components/planters/PlanterForm';
import { Planter } from '@/types';

export default function PlantersPage() {
  const { planters, deletePlanter, credits, weighings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlanter, setEditingPlanter] = useState<Planter | null>(null);

  const filteredPlanters = planters.filter((planter) =>
    `${planter.firstName} ${planter.lastName} ${planter.code} ${planter.village}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce planteur ?')) {
      deletePlanter(id);
    }
  };

  const getPlanterStats = (planterId: string) => {
    const planterWeighings = weighings.filter(w => w.planterId === planterId);
    const planterCredits = credits.filter(c => c.planterId === planterId && !c.isPaid);

    const totalProduction = planterWeighings.reduce((sum, w) => sum + w.netWeight, 0) / 1000;
    const pendingCredits = planterCredits.reduce((sum, c) => sum + c.amount, 0);

    return { totalProduction, pendingCredits };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planteurs</h1>
          <p className="text-gray-600">Gérez les planteurs de caoutchouc</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90 rounded-lg shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Planteur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un Planteur</DialogTitle>
            </DialogHeader>
            <PlanterForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, code ou village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlanters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun planteur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Taille Plantation (ha)</TableHead>
                    <TableHead>Production (tonnes)</TableHead>
                    <TableHead>Créances (FCFA)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlanters.map((planter) => {
                    const stats = getPlanterStats(planter.id);
                    return (
                      <TableRow key={planter.id}>
                        <TableCell className="font-medium">{planter.code}</TableCell>
                        <TableCell>
                          {planter.firstName} {planter.lastName}
                        </TableCell>
                        <TableCell>{planter.village}</TableCell>
                        <TableCell>{planter.plantationSize} ha</TableCell>
                        <TableCell>{stats.totalProduction.toFixed(2)}</TableCell>
                        <TableCell className={stats.pendingCredits > 0 ? 'text-red-600 font-medium' : ''}>
                          {new Intl.NumberFormat('fr-FR').format(stats.pendingCredits)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg shadow-sm"
                                  onClick={() => setEditingPlanter(planter)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Modifier le Planteur</DialogTitle>
                                </DialogHeader>
                                <PlanterForm
                                  planter={editingPlanter}
                                  onSuccess={() => setEditingPlanter(null)}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg shadow-sm"
                              onClick={() => handleDelete(planter.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planteurs</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planters.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Totale</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(weighings.reduce((sum, w) => sum + w.netWeight, 0) / 1000).toFixed(2)} tonnes
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créances en Cours</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR').format(
                credits.filter(c => !c.isPaid).reduce((sum, c) => sum + c.amount, 0)
              )} FCFA
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
