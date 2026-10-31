export type ScheduleRow = { month: number; year: number; payment: number; principal: number; interest: number; balance: number };
export type Loan = { amount: number; annualRate: number; months: number };

/** Standard reducing-balance EMI calculation, with the zero-rate limit handled explicitly. */
export function calculateEmi({ amount, annualRate, months }: Loan): number {
  if (amount <= 0 || months <= 0) return 0;
  const rate = annualRate / 1200;
  if (rate === 0) return amount / months;
  const factor = Math.pow(1 + rate, months);
  return amount * rate * factor / (factor - 1);
}

/** Builds a month-by-month schedule and safely caps the final payment at the outstanding balance. */
export function buildSchedule(loan: Loan, extraMonthly = 0, oneTime = 0): ScheduleRow[] {
  const monthlyRate = loan.annualRate / 1200;
  const basePayment = calculateEmi(loan);
  let balance = loan.amount;
  const rows: ScheduleRow[] = [];
  for (let month = 1; month <= Math.min(loan.months + 600, 1200) && balance > 0.005; month++) {
    const interest = balance * monthlyRate;
    // One-time extra is applied in the first period; extra monthly amounts shorten the loan.
    const requested = basePayment + Math.max(0, extraMonthly) + (month === 1 ? Math.max(0, oneTime) : 0);
    const payment = Math.min(balance + interest, requested);
    const principal = Math.min(balance, Math.max(0, payment - interest));
    balance = Math.max(0, balance - principal);
    rows.push({ month, year: Math.ceil(month / 12), payment, principal, interest, balance });
  }
  return rows;
}

export function formatMoney(value: number, currency: string): string {
  // Use a stable currency locale so server prerendering and the visitor's browser hydrate identically.
  const locales: Record<string, string> = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', AED: 'en-AE', CAD: 'en-CA', AUD: 'en-AU', SGD: 'en-SG' };
  try { return new Intl.NumberFormat(locales[currency] ?? 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value); }
  catch { return `${currency} ${Math.round(value).toLocaleString()}`; }
}
