import { Farmer, Weighing, Credit, Payment, MonthlyRevenue } from '@/types';

export function generatePlanterCode(
  firstName: string,
  lastName: string,
  village: string,
  existingPlanters: Farmer[]
): string {
  const prefix = 'SCAYC';
  const yearSuffix = '12';

  const existingCodes = existingPlanters.map(p => p.code);
  let counter = 1;

  existingCodes.forEach(code => {
    const match = code.match(/SCAYC-12(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= counter) {
        counter = num + 1;
      }
    }
  });

  const paddedCounter = counter.toString().padStart(4, '0');
  return `${prefix}-${yearSuffix}${paddedCounter}`;
}

export function calculateWeighingTotals(
  grossWeight: number,
  tare: number,
  price: number,
  transportCostPerKg: number,
  taxRate: number
): {
  netWeight: number;
  grossAmount: number;
  transportCost: number;
  taxAmount: number;
  netAmount: number;
} {
  const netWeight = grossWeight - tare;
  const grossAmount = netWeight * price;
  const transportCost = netWeight * transportCostPerKg;
  const taxAmount = grossAmount * (taxRate / 100);
  const netAmount = grossAmount - transportCost - taxAmount;

  return {
    netWeight,
    grossAmount,
    transportCost,
    taxAmount,
    netAmount,
  };
}

export function calculatePlanterCredits(credits: Credit[]): {
  totalCredits: number;
  pendingCredits: number;
  paidCredits: number;
} {
  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const pendingCredits = credits
    .filter(credit => !credit.isPaid)
    .reduce((sum, credit) => sum + credit.amount, 0);
  const paidCredits = credits
    .filter(credit => credit.isPaid)
    .reduce((sum, credit) => sum + credit.amount, 0);

  return {
    totalCredits,
    pendingCredits,
    paidCredits,
  };
}

export function calculatePaymentWithCredits(
  grossAmount: number,
  pendingCredits: number
): {
  creditsDeducted: number;
  netAmount: number;
} {
  const creditsDeducted = Math.min(grossAmount, pendingCredits);
  const netAmount = grossAmount - creditsDeducted;

  return {
    creditsDeducted,
    netAmount,
  };
}

export function generateMonthlyRevenues(
  weighings: Weighing[],
  payments: Payment[],
  year: number
): MonthlyRevenue[] {
  const monthlyData: Record<string, { tonnage: number; netPaid: number }> = {};

  weighings
    .filter(w => {
      const weighingYear = new Date(w.weighingDate).getFullYear();
      return weighingYear === year;
    })
    .forEach(weighing => {
      const month = new Date(weighing.weighingDate).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { tonnage: 0, netPaid: 0 };
      }

      monthlyData[month].tonnage += weighing.netWeight / 1000;

      const payment = payments.find(p => p.weighingId === weighing.id);
      if (payment) {
        monthlyData[month].netPaid += payment.netAmount;
      }
    });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    tonnage: data.tonnage,
    netPaid: data.netPaid,
  }));
}

export function calculateAverageRevenue(monthlyRevenues: MonthlyRevenue[]): number {
  if (monthlyRevenues.length === 0) return 0;

  const total = monthlyRevenues.reduce((sum, revenue) => sum + revenue.netPaid, 0);
  return Math.round(total / monthlyRevenues.length);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getCurrentPeriod(): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `PA-${month}/${year}`;
}

export function parseMonthFromPaymentPeriod(period: string): Date {
  const match = period.match(/PA-(\d{2})\/(\d{4})/);
  if (match) {
    const month = parseInt(match[1], 10) - 1;
    const year = parseInt(match[2], 10);
    return new Date(year, month, 1);
  }
  return new Date();
}
