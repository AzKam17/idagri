'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, FileText, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/planterUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReportsPage() {
  const { planters, weighings, bulletins } = useAppStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedPlanterId, setSelectedPlanterId] = useState('');

  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const getAnnualSummary = () => {
    const summary = planters.map((planter) => {
      const planterWeighings = weighings.filter(
        (w) =>
          w.planterId === planter.id &&
          new Date(w.weighingDate).getFullYear().toString() === selectedYear
      );

      const monthlyData = months.map((_, index) => {
        const monthWeighings = planterWeighings.filter(
          (w) => new Date(w.weighingDate).getMonth() === index
        );
        return monthWeighings.reduce((sum, w) => sum + w.netWeight, 0);
      });

      const totalWeight = planterWeighings.reduce((sum, w) => sum + w.netWeight, 0);

      return {
        planter,
        monthlyData,
        totalWeight,
      };
    });

    return summary.filter((s) => s.totalWeight > 0);
  };

  const getIndividualSummary = () => {
    if (!selectedPlanterId) return null;

    const planter = planters.find((p) => p.id === selectedPlanterId);
    if (!planter) return null;

    const planterWeighings = weighings.filter(
      (w) =>
        w.planterId === selectedPlanterId &&
        new Date(w.weighingDate).getFullYear().toString() === selectedYear
    );

    const planterBulletins = bulletins.filter(
      (b) => b.planterId === selectedPlanterId && b.status === 'validated'
    );

    const totalWeight = planterWeighings.reduce((sum, w) => sum + w.netWeight, 0);
    const totalAmount = planterBulletins.reduce((sum, b) => sum + b.netAmount, 0);
    const deliveryCount = planterWeighings.length;

    return {
      planter,
      weighings: planterWeighings,
      totalWeight,
      totalAmount,
      deliveryCount,
      averageAmount: deliveryCount > 0 ? totalAmount / deliveryCount : 0,
    };
  };

  const annualSummary = getAnnualSummary();
  const individualSummary = getIndividualSummary();

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
            <BarChart3 className="h-6 w-6" style={{ color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rapports</h1>
            <p className="text-gray-500">États récapitulatifs et statistiques</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Récapitulatif Annuel Global
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="year">Année:</Label>
            <Input
              id="year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-32"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Planteur</th>
                  {months.map((month) => (
                    <th key={month} className="text-right p-2 text-sm">
                      {month.slice(0, 3)}
                    </th>
                  ))}
                  <th className="text-right p-2 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {annualSummary.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center py-8 text-gray-500">
                      Aucune donnée pour l'année {selectedYear}
                    </td>
                  </tr>
                ) : (
                  annualSummary.map(({ planter, monthlyData, totalWeight }) => (
                    <tr key={planter.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">
                        {planter.code} - {planter.firstName} {planter.lastName}
                      </td>
                      {monthlyData.map((weight, index) => (
                        <td key={index} className="text-right p-2 text-sm">
                          {weight > 0 ? weight.toFixed(0) : '–'}
                        </td>
                      ))}
                      <td className="text-right p-2 font-bold">{totalWeight.toFixed(0)} kg</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Récapitulatif Individuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="planter">Planteur:</Label>
            <Select value={selectedPlanterId} onValueChange={setSelectedPlanterId}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Sélectionner un planteur" />
              </SelectTrigger>
              <SelectContent>
                {planters.map((planter) => (
                  <SelectItem key={planter.id} value={planter.id}>
                    {planter.code} - {planter.firstName} {planter.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {individualSummary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Nombre de livraisons</div>
                  <div className="text-2xl font-bold">{individualSummary.deliveryCount}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Poids total</div>
                  <div className="text-2xl font-bold">{individualSummary.totalWeight.toFixed(0)} kg</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Montant total</div>
                  <div className="text-2xl font-bold">{formatCurrency(individualSummary.totalAmount)} F</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Montant moyen</div>
                  <div className="text-2xl font-bold">{formatCurrency(individualSummary.averageAmount)} F</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Les attestations de revenus et domiciliations seront disponibles dans une prochaine version.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
