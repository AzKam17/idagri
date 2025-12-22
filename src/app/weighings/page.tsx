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
import { Search, Plus, Scale, TrendingUp } from 'lucide-react';
import WeighingForm from '@/components/weighings/WeighingForm';
import { formatCurrency, formatShortDate } from '@/lib/planterUtils';

export default function WeighingsPage() {
  const { weighings, planters, deleteWeighing } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pesées</h1>
          <p className="text-gray-600">Enregistrez les pesées de récolte</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90 rounded-lg shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Pesée
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Pesée</DialogTitle>
            </DialogHeader>
            <WeighingForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

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
                    <TableHead>Poids Brut (kg)</TableHead>
                    <TableHead>Tare (kg)</TableHead>
                    <TableHead>Poids Net (kg)</TableHead>
                    <TableHead>Prix (FCFA/kg)</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Immatriculation</TableHead>
                    <TableHead>Transport (FCFA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWeighings.map((weighing) => (
                    <TableRow key={weighing.id}>
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
                      <TableCell>{weighing.grossWeight.toFixed(0)}</TableCell>
                      <TableCell>{weighing.tare.toFixed(0)}</TableCell>
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
    </div>
  );
}
