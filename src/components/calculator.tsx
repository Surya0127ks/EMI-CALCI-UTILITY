'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownToLine, Calculator as CalculatorIcon, Check, Copy, RotateCcw, Share2, TrendingUp } from 'lucide-react';
import { buildSchedule, calculateEmi, formatMoney, formatAmountReadable } from '@/lib/finance';
import { CURRENCIES, type Currency } from '@/lib/config';
import { AdSlot } from './ads';

export type CalculatorPreset = { amount: number; rate: number; years: number; currency?: Currency; label?: string };
const defaults: CalculatorPreset = { amount: 5000000, rate: 8.5, years: 20, currency: 'INR' };

/** Interactive calculator: clean, user-centric, and focused on essential inputs. */
export function Calculator({ preset = defaults }: { preset?: CalculatorPreset }) {
  const initial = { ...defaults, ...preset };
  const [amount, setAmount] = useState(initial.amount);
  const [rate, setRate] = useState(initial.rate);
  const [tenure, setTenure] = useState(initial.years);
  const [unit, setUnit] = useState<'years' | 'months'>('years');
  const [currency, setCurrency] = useState<Currency>(initial.currency ?? 'INR');
  const [extra, setExtra] = useState(0);
  const [lump, setLump] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scheduleView, setScheduleView] = useState<'monthly' | 'yearly'>('monthly');
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`emicalc-inputs:${window.location.pathname}`);
      if (saved) {
        const value = JSON.parse(saved);
        if (Number.isFinite(value.amount)) setAmount(value.amount);
        if (Number.isFinite(value.rate)) setRate(value.rate);
        if (Number.isFinite(value.tenure)) setTenure(value.tenure);
        if (value.unit === 'months' || value.unit === 'years') setUnit(value.unit);
        if (CURRENCIES.includes(value.currency)) setCurrency(value.currency);
        if (Number.isFinite(value.extra)) setExtra(value.extra);
        if (Number.isFinite(value.lump)) setLump(value.lump);
      }
    } catch { /* use defaults */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(`emicalc-inputs:${window.location.pathname}`, JSON.stringify({ amount, rate, tenure, unit, currency, extra, lump }));
    }
  }, [amount, rate, tenure, unit, currency, extra, lump, hydrated]);

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

  function reset() {
    setAmount(initial.amount);
    setRate(initial.rate);
    setTenure(initial.years);
    setUnit('years');
    setCurrency(initial.currency ?? 'INR');
    setExtra(0);
    setLump(0);
    setHasCalculated(false);
  }

  function handleCalculate() {
    setHasCalculated(true);
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
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const amountReadable = formatAmountReadable(amount, currency);

  return (
    <>
      <section className="calculator-card" aria-label="Loan EMI calculator">
        <div className="calc-heading">
          <h2>Loan Details</h2>
          <button className="reset-button" onClick={reset} aria-label="Reset calculator to defaults">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        <div className="calc-grid">
          {/* INPUTS COLUMN */}
          <div className="inputs-column">
            {/* Field 1: Loan Amount */}
            <div className="field-block">
              <div className="field-label">
                <label htmlFor="loan-amount">Loan amount</label>
                {amountReadable && <span className="field-hint-tag">{amountReadable}</span>}
              </div>
              <div className="number-wrap">
                <input
                  id="loan-amount"
                  type="number"
                  min={100}
                  max={50000000}
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(Math.min(50000000, Math.max(100, Number(e.target.value))))}
                />
                <span className="input-badge">{currency}</span>
              </div>
              <input
                className="range"
                aria-label="Adjust loan amount"
                type="range"
                min={100}
                max={20000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {/* Field 2: Annual Interest Rate */}
            <div className="field-block">
              <div className="field-label">
                <label htmlFor="interest-rate">Interest rate</label>
                <span className="field-hint-tag">{rate}% per year</span>
              </div>
              <div className="number-wrap">
                <input
                  id="interest-rate"
                  type="number"
                  min={0.1}
                  max={30}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Math.min(30, Math.max(0, Number(e.target.value))))}
                />
                <span className="input-badge">% p.a.</span>
              </div>
              <input
                className="range"
                aria-label="Adjust annual interest rate"
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>

            {/* Field 3: Loan Tenure */}
            <div className="field-block">
              <div className="field-label">
                <label htmlFor="tenure">Loan tenure</label>
                <div className="segmented">
                  <button type="button" aria-pressed={unit === 'years'} onClick={() => { if (unit === 'months') setTenure(Math.max(1, Math.round(tenure / 12))); setUnit('years'); }}>Years</button>
                  <button type="button" aria-pressed={unit === 'months'} onClick={() => { if (unit === 'years') setTenure(Math.max(1, Math.round(tenure * 12))); setUnit('months'); }}>Months</button>
                </div>
              </div>
              <div className="number-wrap">
                <input
                  id="tenure"
                  aria-label="Loan tenure"
                  type="number"
                  min={1}
                  max={unit === 'years' ? 40 : 480}
                  value={tenure}
                  onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                />
                <span className="input-badge">{unit}</span>
              </div>
              <input
                className="range"
                aria-label="Adjust loan tenure"
                type="range"
                min={1}
                max={unit === 'years' ? 35 : 420}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
              />
            </div>

            {/* Optional Currency & Prepayment Toggle */}
            <div className="optional-tools">
              <button
                type="button"
                className="optional-toggle-btn"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? '− Hide optional settings' : '+ Currency & Prepayment (Optional)'}
              </button>

              {showAdvanced && (
                <div className="advanced-box">
                  <label className="field-block">
                    <span className="field-label">Display currency</span>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                      {CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
                    </select>
                  </label>
                  <div className="extra-grid">
                    <label>Extra monthly payment<input type="number" min="0" value={extra} onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))} placeholder="0" /></label>
                    <label>One-time payment<input type="number" min="0" value={lump} onChange={(e) => setLump(Math.max(0, Number(e.target.value)))} placeholder="0" /></label>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Calculate Action */}
            <button
              type="button"
              className="calculate-btn"
              onClick={handleCalculate}
              aria-label="Calculate EMI"
            >
              <CalculatorIcon size={20} />
              <span>{hasCalculated ? 'Recalculate EMI' : 'Calculate EMI'}</span>
            </button>
          </div>

          {/* RESULTS COLUMN */}
          <div ref={resultRef} className="result-column" id="emi-result-panel">
            {!hasCalculated ? (
              <div className="result-placeholder">
                <div className="placeholder-icon">
                  <CalculatorIcon size={38} />
                </div>
                <h3>Check your EMI</h3>
                <p>Set your loan amount, interest rate and tenure on the left, then click <strong>Calculate EMI</strong> to see your monthly installment and breakdown.</p>
                <button type="button" className="button button-primary placeholder-btn" onClick={handleCalculate}>
                  Calculate EMI Now
                </button>
              </div>
            ) : (
              <div className="result-panel result-revealed">
                <div className="result-top">
                  <div>
                    <span className="result-label">ESTIMATED MONTHLY EMI</span>
                    <p className="emi-value">{money(emi)}</p>
                    <span className="emi-sub-context">for {tenure} {unit} @ {rate}% p.a.</span>
                  </div>
                  <div className="result-icon-box">
                    <span className="result-icon">₹</span>
                  </div>
                </div>

                <div className="result-lines">
                  <div className="metric">
                    <div className="metric-left">
                      <span className="metric-color-dot" style={{ backgroundColor: 'var(--accent)' }} />
                      <span>Principal amount</span>
                    </div>
                    <strong>{money(amount)}</strong>
                  </div>

                  <div className="metric">
                    <div className="metric-left">
                      <span className="metric-color-dot" style={{ backgroundColor: 'var(--orange)' }} />
                      <span>Total interest payable</span>
                    </div>
                    <strong>{money(totalInterest)}</strong>
                  </div>

                  <div className="metric metric-total">
                    <div className="metric-left">
                      <span>Total amount payable</span>
                    </div>
                    <strong>{money(totalPayment)}</strong>
                  </div>
                </div>

                <div className="ratio">
                  <div
                    className="donut"
                    role="img"
                    aria-label={`Principal ${Math.round((1 - interestRatio) * 100)} percent, interest ${Math.round(interestRatio * 100)} percent`}
                    style={{ background: `conic-gradient(var(--accent) 0% ${(1 - interestRatio) * 100}%, var(--orange) ${(1 - interestRatio) * 100}% 100%)` }}
                  >
                    <span>{Math.round(interestRatio * 100)}%<small>Interest</small></span>
                  </div>
                  <div className="legend">
                    <div className="legend-item"><i className="principal-dot" />Principal <b>{Math.round((1 - interestRatio) * 100)}%</b></div>
                    <div className="legend-item"><i className="interest-dot" />Interest <b>{Math.round(interestRatio * 100)}%</b></div>
                  </div>
                </div>

                {(extra > 0 || lump > 0) && (
                  <div className="savings">
                    <div className="savings-title">
                      <TrendingUp size={16} />
                      <strong>With your extra payments:</strong>
                    </div>
                    <div className="savings-stats">
                      <span><strong>{money(savedInterest)}</strong> interest saved</span>
                      <span><strong>{monthsSaved}</strong> months sooner</span>
                    </div>
                  </div>
                )}

                <div className="result-actions">
                  <button className="button button-primary" onClick={share}>
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button className="button button-outline" onClick={copyResult} aria-label="Copy EMI result">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amortization Schedule (Only visible after calculation or on demand) */}
        {hasCalculated && (
          <div className="schedule">
            <div className="schedule-heading">
              <div>
                <h3>Payment schedule &amp; Amortization</h3>
                <p>Track how your principal reduces month by month.</p>
              </div>
              <button className="download-button" onClick={downloadCsv}>
                <ArrowDownToLine size={16} />
                <span>Download CSV</span>
              </button>
            </div>
            <button className="table-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? 'Hide amortization table' : 'View month-by-month table'}</span>
              <span className="table-toggle-icon">{expanded ? '−' : '+'}</span>
            </button>
            {expanded && (
              <>
                <div className="schedule-tabs" role="group" aria-label="Schedule grouping">
                  <button aria-pressed={scheduleView === 'monthly'} onClick={() => setScheduleView('monthly')}>Month by month</button>
                  <button aria-pressed={scheduleView === 'yearly'} onClick={() => setScheduleView('yearly')}>Year summary</button>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>{scheduleView === 'monthly' ? 'Month' : 'Year'}</th>
                        {scheduleView === 'monthly' && <th>Year</th>}
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(scheduleView === 'monthly' ? base : yearly).map((row) => (
                        <tr key={row.month}>
                          <td>{scheduleView === 'monthly' ? row.month : `Year ${row.year}`}</td>
                          {scheduleView === 'monthly' && <td>{row.year}</td>}
                          <td>{money(row.payment)}</td>
                          <td>{money(row.principal)}</td>
                          <td>{money(row.interest)}</td>
                          <td>{money(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </section>
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL ?? ''} format="auto" />
    </>
  );
}
