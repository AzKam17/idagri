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
import { Search, Plus, CreditCard, CheckCircle, XCircle, User, Calendar, FileText, Trash2 } from 'lucide-react';
import CreditForm from '@/components/credits/CreditForm';
import { formatCurrency, formatShortDate } from '@/lib/planterUtils';
import { Badge } from '@/components/ui/badge';
import { Credit } from '@/types';

export default function CreditsPage() {
  const { credits, farmers, updateCredit } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'money' | 'tools'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const creditsWithFarmers = credits.map(credit => {
    const farmer = farmers.find(f => f.id === credit.farmerId);
    return { ...credit, farmer };
  });

  const filteredCredits = creditsWithFarmers.filter((credit) => {
    const searchString = `${credit.farmer?.code || ''} ${credit.farmer?.firstName || ''} ${credit.farmer?.lastName || ''} ${credit.description}`;
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

  const handleRowClick = (credit: any) => {
    setSelectedCredit(credit);
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
            <CreditCard style={{ width: '20px', height: '20px', color: '#00a540' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Créances</h1>
            <p className="text-muted-foreground text-sm">Gérez les créances des planteurs</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Ajouter une Créance
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une Créance</DialogTitle>
          </DialogHeader>
          <CreditForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.map((credit) => (
                    <TableRow key={credit.id} onClick={() => handleRowClick(credit)} style={{ cursor: 'pointer' }}>
                      <TableCell>{formatShortDate(credit.date)}</TableCell>
                      <TableCell>
                        {credit.farmer ? (
                          <div>
                            <div className="font-medium">{credit.farmer.code}</div>
                            <div className="text-sm text-gray-600">
                              {credit.farmer.firstName} {credit.farmer.lastName}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Panel */}
      {isPanelOpen && selectedCredit && (
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
                {/* Credit Details */}
                <div className="flex flex-col items-center justify-center gap-5 mb-10">
                  <div className={`h-24 w-24 rounded-full ${selectedCredit.isPaid ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center shadow-lg`}>
                    {selectedCredit.isPaid ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold leading-10 text-neutral-900">
                      {formatCurrency(selectedCredit.amount)} FCFA
                    </div>
                    <div className="text-base text-neutral-600 mt-1">
                      {selectedCredit.isPaid ? 'Créance payée' : 'Créance en attente'}
                    </div>
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
                      {selectedCredit.farmer ? `${selectedCredit.farmer.code} - ${selectedCredit.farmer.firstName} ${selectedCredit.farmer.lastName}` : '-'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Type</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">
                      <Badge variant={selectedCredit.type === 'money' ? 'default' : 'secondary'} className="rounded-md">
                        {selectedCredit.type === 'money' ? 'Argent' : 'Outils'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Description</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{selectedCredit.description}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-neutral-600" />
                      <div className="text-base font-medium text-neutral-600">Date</div>
                    </div>
                    <div className="text-right text-base text-neutral-900">{formatShortDate(selectedCredit.date)}</div>
                  </div>

                  {selectedCredit.isPaid && selectedCredit.paidDate && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div className="text-base font-medium text-neutral-600">Date de Paiement</div>
                      </div>
                      <div className="text-right text-base text-green-600 font-semibold">{formatShortDate(selectedCredit.paidDate)}</div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-6 mt-8 flex flex-col gap-3">
                  {!selectedCredit.isPaid && (
                    <Button
                      onClick={() => {
                        handleMarkAsPaid(selectedCredit.id);
                        setIsPanelOpen(false);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marquer comme payée
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
