'use client';

import React from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { farmersState } from '@/atoms/farmers';
import { plantationsState } from '@/atoms/plantations';
import { employeesState } from '@/atoms/employees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Sprout, Users, Map, ArrowRight, Plus } from 'lucide-react';

export default function HomePage() {
  const farmers = useRecoilValue(farmersState);
  const plantations = useRecoilValue(plantationsState);
  const employees = useRecoilValue(employeesState);

  const stats = [
    {
      title: 'Farmers',
      value: farmers.length,
      icon: User,
      href: '/farmers',
      description: 'Registered farmers',
      color: 'text-blue-600',
    },
    {
      title: 'Plantations',
      value: plantations.length,
      icon: Sprout,
      href: '/plantations',
      description: 'Active plantations',
      color: 'text-green-600',
    },
    {
      title: 'Employees',
      value: employees.length,
      icon: Users,
      href: '/employees',
      description: 'Active employees',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to IdAgri</h1>
        <p className="text-lg text-muted-foreground">
          Manage your farmers, plantations, and employees all in one place
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
                    View All
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
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/farmers?action=add">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Add New Farmer
              </Button>
            </Link>
            <Link href="/plantations?action=add">
              <Button variant="outline" className="w-full justify-start">
                <Sprout className="mr-2 h-4 w-4" />
                Add New Plantation
              </Button>
            </Link>
            <Link href="/employees?action=add">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add New Employee
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="w-full justify-start">
                <Map className="mr-2 h-4 w-4" />
                View Plantation Map
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Features
            </CardTitle>
            <CardDescription>What you can do with IdAgri</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>Register and manage farmers with photos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>Track plantations with GPS coordinates and polygon boundaries</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>Manage employees and assign them to plantations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>Generate QR codes for quick farmer identification</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>View interactive maps with plantation locations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-4 w-4 text-primary">✓</div>
                <span>Filter and search by city and other criteria</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
