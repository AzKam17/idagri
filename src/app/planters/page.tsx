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
import { Search, Plus, Edit, Trash2, CreditCard, Scale, FileText, User, MapPin } from 'lucide-react';
import PlanterForm from '@/components/planters/PlanterForm';
import { Planter } from '@/types';

export default function PlantersPage() {
  const { planters, deletePlanter, credits, weighings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlanter, setEditingPlanter] = useState<Planter | null>(null);
  const [selectedPlanter, setSelectedPlanter] = useState<Planter | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const handleRowClick = (planter: Planter) => {
    setSelectedPlanter(planter);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: 'color-mix(in srgb, #00a540 10%, transparent)'
          }}>
            <FileText style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Planteurs</h1>
            <p className="text-muted-foreground text-sm">Gérez les planteurs de caoutchouc</p>
          </div>
        </div>
        <Button onClick={() => { setEditingPlanter(null); setIsAddDialogOpen(true); }}>
          <Plus className="w-4 h-4" />
          Ajouter un Planteur
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlanter ? 'Modifier le Planteur' : 'Ajouter un Planteur'}</DialogTitle>
          </DialogHeader>
          <PlanterForm planter={editingPlanter || undefined} onSuccess={() => { setIsAddDialogOpen(false); setEditingPlanter(null); }} />
        </DialogContent>
      </Dialog>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlanters.map((planter) => {
                    const stats = getPlanterStats(planter.id);
                    return (
                      <TableRow key={planter.id} onClick={() => handleRowClick(planter)} style={{ cursor: 'pointer' }}>
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

      {/* Right Panel */}
      {isPanelOpen && selectedPlanter && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-[998] fade-in-overlay"
            onClick={() => setIsPanelOpen(false)}
          />
          <div className="w-[31%] fixed bottom-0 right-0 top-0 z-[999] min-h-screen bg-white shadow-2xl slide-in-left">
            <div className="flex h-screen flex-col border-l border-neutral-200 bg-white">
              {/* Close Button */}
              <div className="absolute left-6 top-10 h-12 w-12">
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-900 cursor-pointer hover:opacity-70 transition-all duration-300"
                >
                  <svg className="h-6 w-6 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.6666 2.6835L21.3166 0.333496L11.9999 9.65016L2.68325 0.333496L0.333252 2.6835L9.64992 12.0002L0.333252 21.3168L2.68325 23.6668L11.9999 14.3502L21.3166 23.6668L23.6666 21.3168L14.3499 12.0002L23.6666 2.6835Z" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-y-auto pt-28 pb-8">
                {/* Planter Name */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {selectedPlanter.firstName} {selectedPlanter.lastName}
                    </div>
                    <div className="text-base text-neutral-600 mt-1">Code: {selectedPlanter.code}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 border-t border-b border-neutral-200 px-6 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Village</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedPlanter.village}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Taille Plantation</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedPlanter.plantationSize} ha</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Production</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{getPlanterStats(selectedPlanter.id).totalProduction.toFixed(2)} tonnes</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Créances</div>
                    </div>
                    <div className={`text-right text-base ${getPlanterStats(selectedPlanter.id).pendingCredits > 0 ? 'text-red-600 font-semibold' : 'text-neutral-900'}`}>
                      {new Intl.NumberFormat('fr-FR').format(getPlanterStats(selectedPlanter.id).pendingCredits)} FCFA
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 mt-8 flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      setEditingPlanter(selectedPlanter);
                      setIsAddDialogOpen(true);
                      setIsPanelOpen(false);
                    }}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer ce planteur ?')) {
                        handleDelete(selectedPlanter.id);
                        setIsPanelOpen(false);
                      }
                    }}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
