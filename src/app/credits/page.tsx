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
import { Search, Plus, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import CreditForm from '@/components/credits/CreditForm';
import { formatCurrency, formatShortDate } from '@/lib/planterUtils';
import { Badge } from '@/components/ui/badge';

export default function CreditsPage() {
  const { credits, planters, updateCredit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'money' | 'tools'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const creditsWithPlanters = credits.map(credit => {
    const planter = planters.find(p => p.id === credit.planterId);
    return { ...credit, planter };
  });

  const filteredCredits = creditsWithPlanters.filter((credit) => {
    const searchString = `${credit.planter?.code || ''} ${credit.planter?.firstName || ''} ${credit.planter?.lastName || ''} ${credit.description}`;
    const matchesSearch = searchString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || credit.type === filterType;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'pending' && !credit.isPaid) ||
      (filterStatus === 'paid' && credit.isPaid);

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPending = credits
    .filter(c => !c.isPaid)
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaid = credits
    .filter(c => c.isPaid)
    .reduce((sum, c) => sum + c.amount, 0);

  const handleMarkAsPaid = (creditId: string) => {
    const credit = credits.find(c => c.id === creditId);
    if (credit && confirm('Marquer cette créance comme payée ?')) {
      updateCredit(creditId, {
        ...credit,
        isPaid: true,
        paidDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créances</h1>
          <p className="text-gray-600">Gérez les créances des planteurs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90 rounded-lg shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Créance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une Créance</DialogTitle>
            </DialogHeader>
            <CreditForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Créances</CardTitle>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPending + totalPaid)} FCFA</div>
            <p className="text-xs text-gray-600 mt-1">
              {credits.length} créance{credits.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPending)} FCFA</div>
            <p className="text-xs text-gray-600 mt-1">
              {credits.filter(c => !c.isPaid).length} créance{credits.filter(c => !c.isPaid).length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payées</CardTitle>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)} FCFA</div>
            <p className="text-xs text-gray-600 mt-1">
              {credits.filter(c => c.isPaid).length} créance{credits.filter(c => c.isPaid).length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par planteur ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">Tous les types</option>
                <option value="money">Argent</option>
                <option value="tools">Outils</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="paid">Payées</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCredits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune créance trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Planteur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date Paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>{formatShortDate(credit.date)}</TableCell>
                      <TableCell>
                        {credit.planter ? (
                          <div>
                            <div className="font-medium">{credit.planter.code}</div>
                            <div className="text-sm text-gray-600">
                              {credit.planter.firstName} {credit.planter.lastName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={credit.type === 'money' ? 'default' : 'secondary'} className="rounded-md">
                          {credit.type === 'money' ? 'Argent' : 'Outils'}
                        </Badge>
                      </TableCell>
                      <TableCell>{credit.description}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(credit.amount)} FCFA</TableCell>
                      <TableCell>
                        {credit.isPaid ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 rounded-md">
                            Payée
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 rounded-md">
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {credit.paidDate ? formatShortDate(credit.paidDate) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {!credit.isPaid && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPaid(credit.id)}
                            className="bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm"
                          >
                            Marquer payée
                          </Button>
                        )}
                      </TableCell>
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
