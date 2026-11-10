'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowDownToLine, Calculator as CalculatorIcon, Check, Copy, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { buildSchedule, calculateEmi, formatMoney } from '@/lib/finance';
import { CURRENCIES, type Currency } from '@/lib/config';
import { AdSlot } from './ads';

export type CalculatorPreset = { amount: number; rate: number; years: number; currency?: Currency; label?: string };
const defaults: CalculatorPreset = { amount: 5000000, rate: 8.5, years: 20, currency: 'INR' };

/** Interactive calculator: calculations, saved inputs, sharing, and CSV export stay in this browser. */
export function Calculator({ preset = defaults }: { preset?: CalculatorPreset }) {
  const initial = { ...defaults, ...preset };
  const [amount, setAmount] = useState(initial.amount);
  const [rate, setRate] = useState(initial.rate);
  const [tenure, setTenure] = useState(initial.years);
  const [unit, setUnit] = useState<'years' | 'months'>('years');
  const [currency, setCurrency] = useState<Currency>(initial.currency ?? 'INR');
  const [extra, setExtra] = useState(0);
  const [lump, setLump] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [scheduleView, setScheduleView] = useState<'monthly' | 'yearly'>('monthly');
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [highlightResult, setHighlightResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Keep each loan preset's remembered values separate from the others.
      const saved = localStorage.getItem(`emicalc-inputs:${window.location.pathname}`);
      if (saved) { const value = JSON.parse(saved); if (Number.isFinite(value.amount)) setAmount(value.amount); if (Number.isFinite(value.rate)) setRate(value.rate); if (Number.isFinite(value.tenure)) setTenure(value.tenure); if (value.unit === 'months' || value.unit === 'years') setUnit(value.unit); if (CURRENCIES.includes(value.currency)) setCurrency(value.currency); if (Number.isFinite(value.extra)) setExtra(value.extra); if (Number.isFinite(value.lump)) setLump(value.lump); }
    } catch { /* Ignore malformed older browser storage and use the page defaults. */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(`emicalc-inputs:${window.location.pathname}`, JSON.stringify({ amount, rate, tenure, unit, currency, extra, lump })); }, [amount, rate, tenure, unit, currency, extra, lump, hydrated]);

  const months = Math.max(1, Math.round(unit === 'years' ? tenure * 12 : tenure));
  const base = useMemo(() => buildSchedule({ amount, annualRate: rate, months }), [amount, rate, months]);
  const adjusted = useMemo(() => buildSchedule({ amount, annualRate: rate, months }, extra, lump), [amount, rate, months, extra, lump]);
  const emi = calculateEmi({ amount, annualRate: rate, months });
  const totalInterest = base.reduce((sum, row) => sum + row.interest, 0);
  const totalPayment = amount + totalInterest;
  const savedInterest = Math.max(0, totalInterest - adjusted.reduce((sum, row) => sum + row.interest, 0));
  const monthsSaved = Math.max(0, base.length - adjusted.length);
  const interestRatio = totalPayment ? totalInterest / totalPayment : 0;
  const yearly = useMemo(() => Object.values(base.reduce<Record<number, { month: number; year: number; payment: number; principal: number; interest: number; balance: number }>>((groups, row) => {
    const group = groups[row.year] ?? { month: row.month, year: row.year, payment: 0, principal: 0, interest: 0, balance: 0 };
    group.payment += row.payment; group.principal += row.principal; group.interest += row.interest; group.balance = row.balance; groups[row.year] = group; return groups;
  }, {})), [base]);
  const money = (value: number) => formatMoney(value, currency);

  function reset() { setAmount(initial.amount); setRate(initial.rate); setTenure(initial.years); setUnit('years'); setCurrency(initial.currency ?? 'INR'); setExtra(0); setLump(0); }

  function handleCalculate() {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightResult(true);
      window.setTimeout(() => setHighlightResult(false), 1400);
    }
  }

  function downloadCsv() {
    const rows = [['Month', 'Year', 'Payment', 'Principal', 'Interest', 'Balance'], ...base.map((row) => [row.month, row.year, row.payment.toFixed(2), row.principal.toFixed(2), row.interest.toFixed(2), row.balance.toFixed(2)])];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'emi-amortization-schedule.csv'; link.click(); URL.revokeObjectURL(url);
  }
  async function share() {
    const summary = `EMI estimate: ${money(emi)} per month for ${months} months at ${rate}% annual interest.`;
    if (navigator.share) await navigator.share({ title: 'My loan estimate', text: summary });
    else await copyResult();
  }
  async function copyResult() {
    const summary = `EMI estimate: ${money(emi)} per month for ${months} months at ${rate}% annual interest.`;
    await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }
  return <>
    <section className="calculator-card" aria-label="Loan EMI calculator">
      <div className="calc-heading"><div><span className="eyebrow"><Sparkles size={13} /> YOUR LOAN, MADE CLEAR</span><h2>Loan details</h2></div><button className="reset-button" onClick={reset} aria-label="Reset calculator"><RotateCcw size={15} /> Reset</button></div>
      <div className="calc-grid">
        <div className="inputs-column">
          <Field label="Loan amount" suffix={currency} value={amount} min={100} max={50000000} step={100} onChange={setAmount} presets={[100000, 500000, 1000000, 2500000, 5000000, 10000000]} />
          <Field label="Annual interest rate" suffix="% p.a." value={rate} min={0} max={30} step={0.05} decimals onChange={setRate} presets={[7.5, 8.5, 9.5, 10.5, 12]} />
          <div className="field-block">
            <div className="field-label">
              <label htmlFor="tenure">Loan tenure</label>
              <div className="segmented">
                <button type="button" aria-pressed={unit === 'years'} onClick={() => { if (unit === 'months') setTenure(Math.max(1, Math.round(tenure / 12))); setUnit('years'); }}>Years</button>
                <button type="button" aria-pressed={unit === 'months'} onClick={() => { if (unit === 'years') setTenure(Math.max(1, Math.round(tenure * 12))); setUnit('months'); }}>Months</button>
              </div>
            </div>
            <div className="number-wrap">
              <input id="tenure" aria-label="Loan tenure" type="number" min={1} max={unit === 'years' ? 40 : 480} value={tenure} onChange={(event) => setTenure(Math.max(1, Number(event.target.value)))} />
              <span>{unit}</span>
            </div>
            <input className="range" aria-label="Adjust loan tenure" type="range" min={1} max={unit === 'years' ? 40 : 480} value={tenure} onChange={(event) => setTenure(Number(event.target.value))} />
            <div className="quick-presets" aria-label="Quick tenure presets">
              {(unit === 'years' ? [5, 10, 15, 20, 25, 30] : [12, 24, 36, 60, 120, 240]).map((t) => (
                <button key={t} type="button" className={`quick-chip ${tenure === t ? 'active' : ''}`} onClick={() => setTenure(t)}>
                  {t} {unit === 'years' ? 'Yrs' : 'Mos'}
                </button>
              ))}
            </div>
          </div>
          <label className="field-block currency-field"><span className="field-label">Display currency</span><select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>{CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}</select></label>
          <details className="prepayment"><summary>Include an extra payment <span>Optional</span></summary><div className="extra-grid"><label>Extra each month<input type="number" min="0" value={extra} onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))} /></label><label>One-time payment<input type="number" min="0" value={lump} onChange={(e) => setLump(Math.max(0, Number(e.target.value)))} /></label></div></details>
          <button type="button" className="calculate-btn" onClick={handleCalculate} aria-label="Calculate EMI and jump to output">
            <CalculatorIcon size={18} />
            <span>Calculate EMI &amp; View Result</span>
            <ArrowDown size={18} className="calc-arrow-icon" />
          </button>
        </div>
        <div ref={resultRef} className={`result-panel ${highlightResult ? 'result-highlight' : ''}`} id="emi-result-panel">
          <div className="result-top"><div><span className="result-label">ESTIMATED MONTHLY EMI</span><p className="emi-value">{money(emi)}</p></div><span className="result-icon">₹</span></div>
          <div className="result-lines"><Metric label="Principal amount" value={money(amount)} /><Metric label="Total interest" value={money(totalInterest)} /><Metric label="Total payment" value={money(totalPayment)} /></div>
          <div className="ratio"><div className="donut" role="img" aria-label={`Principal ${Math.round((1 - interestRatio) * 100)} percent, interest ${Math.round(interestRatio * 100)} percent`} style={{ background: `conic-gradient(var(--accent) 0% ${(1 - interestRatio) * 100}%, #facb83 ${(1 - interestRatio) * 100}% 100%)` }}><span>{Math.round(interestRatio * 100)}<small>% interest</small></span></div><div className="legend"><span><i className="principal-dot" />Principal <b>{Math.round((1 - interestRatio) * 100)}%</b></span><span><i className="interest-dot" />Interest <b>{Math.round(interestRatio * 100)}%</b></span></div></div>
          {(extra > 0 || lump > 0) && <div className="savings"><strong>With your extra payments</strong><span>{money(savedInterest)} interest saved</span><span>{monthsSaved} months sooner</span></div>}
          <div className="result-actions"><button className="button button-primary" onClick={share}><Share2 size={16} /> Share result</button><button className="button button-outline" onClick={copyResult} aria-label="Copy EMI result">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button></div>
        </div>
      </div>
      <div className="schedule"><div className="schedule-heading"><div><h3>Payment schedule</h3><p>See how each payment reduces your balance.</p></div><button className="download-button" onClick={downloadCsv}><ArrowDownToLine size={16} /> Download CSV</button></div><button className="table-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide' : 'View'} amortization table <span>{expanded ? '−' : '+'}</span></button>{expanded && <><div className="schedule-tabs" role="group" aria-label="Schedule grouping"><button aria-pressed={scheduleView === 'monthly'} onClick={() => setScheduleView('monthly')}>Month by month</button><button aria-pressed={scheduleView === 'yearly'} onClick={() => setScheduleView('yearly')}>Year summary</button></div><div className="table-scroll"><table><thead><tr><th>{scheduleView === 'monthly' ? 'Month' : 'Year'}</th>{scheduleView === 'monthly' && <th>Year</th>}<th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{(scheduleView === 'monthly' ? base : yearly).map((row) => <tr key={row.month}><td>{scheduleView === 'monthly' ? row.month : `Year ${row.year}`}</td>{scheduleView === 'monthly' && <td>{row.year}</td>}<td>{money(row.payment)}</td><td>{money(row.principal)}</td><td>{money(row.interest)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div></>}</div>
    </section>
    <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL ?? ''} format="auto" />
  </>;
}

function Field({ label, suffix, value, min, max, step, decimals, presets, onChange }: { label: string; suffix: string; value: number; min: number; max: number; step: number; decimals?: boolean; presets?: number[]; onChange: (value: number) => void }) {
  const formatChip = (val: number) => {
    if (decimals) return `${val}%`;
    if (val >= 10000000) return `₹${val / 10000000} Cr`;
    if (val >= 100000) return `₹${val / 100000} Lakh`;
    return `₹${val}`;
  };

  return <div className="field-block">
    <div className="field-label"><label htmlFor={label.replaceAll(' ', '-')}>{label}</label></div>
    <div className="number-wrap"><input id={label.replaceAll(' ', '-')} type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value))))} /><span>{suffix}</span></div>
    <input className="range" aria-label={`Adjust ${label.toLowerCase()}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    {presets && (
      <div className="quick-presets" aria-label={`Quick ${label.toLowerCase()} presets`}>
        {presets.map((presetVal) => (
          <button
            key={presetVal}
            type="button"
            className={`quick-chip ${value === presetVal ? 'active' : ''}`}
            onClick={() => onChange(presetVal)}
          >
            {formatChip(presetVal)}
          </button>
        ))}
      </div>
    )}
    {decimals && <p className="field-hint">Enter the nominal yearly rate offered by your lender.</p>}
  </div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }
