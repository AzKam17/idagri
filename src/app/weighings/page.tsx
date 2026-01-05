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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Scale, TrendingUp, Trash2, User, Truck } from 'lucide-react';
import WeighingForm from '@/components/weighings/WeighingForm';
import { formatCurrency, formatShortDate } from '@/lib/planterUtils';
import { Weighing, Planter } from '@/types';

type WeighingWithPlanter = Weighing & { planter?: Planter };

export default function WeighingsPage() {
  const { weighings, planters, deleteWeighing } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWeighing, setSelectedWeighing] = useState<WeighingWithPlanter | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const weighingsWithPlanters = weighings.map(weighing => {
    const planter = planters.find(p => p.id === weighing.planterId);
    return { ...weighing, planter };
  });

  const filteredWeighings = weighingsWithPlanters.filter((weighing) => {
    const searchString = `${weighing.planter?.code || ''} ${weighing.planter?.firstName || ''} ${weighing.planter?.lastName || ''} ${weighing.period} ${weighing.driverName}`;
    return searchString.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalProduction = weighings.reduce((sum, w) => sum + w.netWeight, 0) / 1000;
  const totalGrossAmount = weighings.reduce(
    (sum, w) => sum + w.netWeight * w.price,
    0
  );

  const handleRowClick = (weighing: WeighingWithPlanter) => {
    setSelectedWeighing(weighing);
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
            <Scale style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pesées</h1>
            <p className="text-muted-foreground text-sm">Enregistrez les pesées de récolte</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nouvelle Pesée
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Pesée</DialogTitle>
          </DialogHeader>
          <WeighingForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Totale</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProduction.toFixed(2)} tonnes</div>
            <p className="text-xs text-gray-600 mt-1">
              {weighings.length} pesée{weighings.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Brut Total</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGrossAmount)} FCFA</div>
            <p className="text-xs text-gray-600 mt-1">Avant déductions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par planteur, période ou chauffeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWeighings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune pesée enregistrée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Planteur</TableHead>
                    <TableHead>Poids à charge (kg)</TableHead>
                    <TableHead>Poids à vide (kg)</TableHead>
                    <TableHead>Poids Net (kg)</TableHead>
                    <TableHead>Prix (FCFA/kg)</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Transport (FCFA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWeighings.map((weighing) => (
                    <TableRow key={weighing.id} onClick={() => handleRowClick(weighing)} style={{ cursor: 'pointer' }}>
                      <TableCell>{formatShortDate(weighing.weighingDate)}</TableCell>
                      <TableCell className="font-medium">{weighing.period}</TableCell>
                      <TableCell>
                        {weighing.planter ? (
                          <div>
                            <div className="font-medium">{weighing.planter.code}</div>
                            <div className="text-sm text-gray-600">
                              {weighing.planter.firstName} {weighing.planter.lastName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{weighing.loadedWeight.toFixed(0)}</TableCell>
                      <TableCell>{weighing.emptyWeight.toFixed(0)}</TableCell>
                      <TableCell className="font-medium">{weighing.netWeight.toFixed(0)}</TableCell>
                      <TableCell>{weighing.price}</TableCell>
                      <TableCell>{weighing.driverName}</TableCell>
                      <TableCell className="font-mono text-sm">{weighing.vehicleRegistration}</TableCell>
                      <TableCell>{formatCurrency(weighing.transportCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Panel */}
      {isPanelOpen && selectedWeighing && (
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
                {/* Weighing Details */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center shadow-lg">
                    <Scale className="h-12 w-12 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {selectedWeighing.period}
                    </div>
                    <div className="text-base text-neutral-600 mt-1">{formatShortDate(selectedWeighing.weighingDate)}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6 border-t border-b border-neutral-200 px-6 py-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Planteur</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">
                      {selectedWeighing.planter ? `${selectedWeighing.planter.code} - ${selectedWeighing.planter.firstName} ${selectedWeighing.planter.lastName}` : '-'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Poids à charge</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedWeighing.loadedWeight.toFixed(0)} kg</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Poids à vide</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedWeighing.emptyWeight.toFixed(0)} kg</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Poids Net</div>
                    </div>
                    <div className="text-right text-base text-neutral-900 font-semibold">{selectedWeighing.netWeight.toFixed(0)} kg</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Prix</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedWeighing.price} FCFA/kg</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Chauffeur</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedWeighing.driverName}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Immatriculation</div>
                    </div>
                    <div className="text-right text-base text-neutral-900 font-mono text-sm">{selectedWeighing.vehicleRegistration}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Transport</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{formatCurrency(selectedWeighing.transportCost)} FCFA</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 mt-8 flex flex-col gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer cette pesée ?')) {
                        deleteWeighing(selectedWeighing.id);
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
