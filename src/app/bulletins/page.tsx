'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Bulletin, BulletinStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/planterUtils';

export default function BulletinsPage() {
  const { bulletins, farmers, weighings, credits } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Get farmers with unpaid weighings
  const getFarmersWithUnpaidWeighings = () => {
    return farmers.filter((farmer) => {
      const farmerWeighings = weighings.filter((w) => w.farmerId === farmer.id);
      const paidWeighingIds = bulletins
        .filter((b) => b.status !== 'cancelled')
        .flatMap((b) => b.weighingIds);
      const unpaidWeighings = farmerWeighings.filter((w) => !paidWeighingIds.includes(w.id));
      return unpaidWeighings.length > 0;
    });
  };

  const farmersWithUnpaidWeighings = getFarmersWithUnpaidWeighings();

  const getStatusBadge = (status: BulletinStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      validated: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      draft: 'Brouillon',
      validated: 'Validé',
      cancelled: 'Annulé',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getFarmerName = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId);
    return farmer ? `${farmer.code} - ${farmer.firstName} ${farmer.lastName}` : 'Inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <FileText className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bulletins de Paye</h1>
            <p className="text-gray-500">Gérer les bulletins et paiements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planteurs en attente</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmersWithUnpaidWeighings.length}</div>
            <p className="text-xs text-gray-600 mt-1">Planteurs avec pesées non payées</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulletins validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bulletins.filter((b) => b.status === 'validated').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Prêts pour virement</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulletins brouillon</CardTitle>
            <Eye className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bulletins.filter((b) => b.status === 'draft').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">En attente de validation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Planteurs en attente de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            {farmersWithUnpaidWeighings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun planteur en attente</p>
            ) : (
              <div className="space-y-2">
                {farmersWithUnpaidWeighings.slice(0, 10).map((farmer) => {
                  const unpaidWeighings = weighings.filter((w) => {
                    const paidIds = bulletins
                      .filter((b) => b.status !== 'cancelled')
                      .flatMap((b) => b.weighingIds);
                    return w.farmerId === farmer.id && !paidIds.includes(w.id);
                  });
                  const totalWeight = unpaidWeighings.reduce((sum, w) => sum + w.netWeight, 0);

                  return (
                    <div
                      key={farmer.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <div className="font-medium">{farmer.code}</div>
                        <div className="text-sm text-gray-600">
                          {farmer.firstName} {farmer.lastName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{totalWeight.toFixed(0)} kg</div>
                        <div className="text-sm text-gray-600">
                          {unpaidWeighings.length} pesée{unpaidWeighings.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Bulletins récents</CardTitle>
          </CardHeader>
          <CardContent>
            {bulletins.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun bulletin généré</p>
            ) : (
              <div className="space-y-2">
                {bulletins.slice(0, 10).map((bulletin) => (
                  <div
                    key={bulletin.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{getFarmerName(bulletin.farmerId)}</div>
                      <div className="text-sm text-gray-600">
                        {bulletin.period} • {new Date(bulletin.generatedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right mr-3">
                      <div className="font-medium">{formatCurrency(bulletin.netAmount)} FCFA</div>
                    </div>
                    {getStatusBadge(bulletin.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md rounded-xl">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            La génération complète des bulletins avec PDF sera disponible prochainement.
            <br />
            Pour l'instant, vous pouvez consulter l'état des paiements ci-dessus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
