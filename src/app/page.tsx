'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Sprout, Users, Map, ArrowRight, Plus } from 'lucide-react';
import { translations } from '@/lib/translations';

export default function HomePage() {
  const farmers = useAppStore((state) => state.farmers);
  const plantations = useAppStore((state) => state.plantations);
  const employees = useAppStore((state) => state.employees);

  const totalArea = plantations.reduce((sum, p) => sum + Number(p.area), 0);

  const stats = [
    {
      title: translations.home.totalFarmers,
      value: farmers.length,
      icon: User,
      href: '/farmers',
      description: 'agriculteurs enregistrés',
      color: 'text-blue-600',
    },
    {
      title: translations.home.totalPlantations,
      value: plantations.length,
      icon: Sprout,
      href: '/plantations',
      description: 'plantations actives',
      color: 'text-green-600',
    },
    {
      title: translations.home.totalEmployees,
      value: employees.length,
      icon: Users,
      href: '/employees',
      description: 'employés actifs',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">{translations.home.title}</h1>
        <p className="text-lg text-muted-foreground">
          {translations.home.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    {translations.common.viewDetails}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {translations.home.quickActions}
            </CardTitle>
            <CardDescription>Actions courantes pour commencer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/farmers?action=add">
              <Button variant="outline" className="w-full justify-start h-11">
                <User className="mr-2 h-4 w-4" />
                {translations.home.addFarmer}
              </Button>
            </Link>
            <Link href="/plantations?action=add">
              <Button variant="outline" className="w-full justify-start h-11">
                <Sprout className="mr-2 h-4 w-4" />
                {translations.home.addPlantation}
              </Button>
            </Link>
            <Link href="/employees?action=add">
              <Button variant="outline" className="w-full justify-start h-11">
                <Users className="mr-2 h-4 w-4" />
                {translations.home.addEmployee}
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="w-full justify-start h-11">
                <Map className="mr-2 h-4 w-4" />
                {translations.home.viewMap}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              {translations.home.features}
            </CardTitle>
            <CardDescription>Ce que vous pouvez faire avec IdAgri</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">✓</div>
                <span>{translations.home.featureManageFarmersDesc}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">✓</div>
                <span>{translations.home.featureTrackPlantationsDesc}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">✓</div>
                <span>{translations.home.featureEmployeesDesc}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">✓</div>
                <span>{translations.home.featureInteractiveMapDesc}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
