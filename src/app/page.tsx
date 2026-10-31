import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import { Calculator } from '@/components/calculator';
import { Article, generalFaq, generalSections } from '@/components/content';
import { metadataFor, structuredData } from '@/lib/seo';
import { DEFAULT_DESCRIPTION } from '@/lib/config';

export const metadata: Metadata = metadataFor('Free Loan EMI Calculator: Estimate Payments & Interest', DEFAULT_DESCRIPTION, '/');
const schema = structuredData('/', 'Free Loan EMI Calculator', DEFAULT_DESCRIPTION, generalFaq);
export default function HomePage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><section className="hero"><div className="hero-inner"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14} /> A LITTLE MORE CLARITY FOR BIG DECISIONS</span><h1>Know your EMI.<br /><span>Plan with confidence.</span></h1><p>Estimate monthly payments, understand the total cost and explore a smarter way to repay. Simple, private and free.</p><div className="hero-points"><span><ShieldCheck size={16} /> Calculations stay on your device</span><span><TrendingDown size={16} /> Explore prepayment scenarios</span></div></div><div className="hero-note"><span className="note-mark">↗</span><p>Small changes to rate or tenure can make a big difference over time.</p><span className="note-caption">Make the numbers visible.</span></div></div></section><div className="main-wrap"><div className="calculator-anchor"><Calculator /></div><section className="loan-links"><div><span className="eyebrow">MADE FOR YOUR NEXT STEP</span><h2>Choose a loan calculator</h2><p>Start with a preset tailored to the borrowing decision you are exploring.</p></div><div className="loan-link-grid"><LoanLink href="/home-loan-emi-calculator/" title="Home loan" description="Plan a home purchase and compare long-term costs." /><LoanLink href="/car-loan-emi-calculator/" title="Car loan" description="See how your down payment and term affect the monthly budget." /><LoanLink href="/personal-loan-emi-calculator/" title="Personal loan" description="Estimate repayments for a planned expense or consolidation." /></div></section><Article sections={generalSections} faq={generalFaq} /></div></>;
}
function LoanLink({ href, title, description }: { href: string; title: string; description: string }) { return <Link className="loan-link-card" href={href}><span><strong>{title}</strong><small>{description}</small></span><ArrowRight size={18} /></Link>; }
