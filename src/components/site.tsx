import Link from 'next/link';
import { Calculator as CalculatorIcon, ArrowUpRight } from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL } from '@/lib/config';
import { ThemeToggle } from './theme';
import { AdPreferences } from './ad-preferences';

export function Header() {
  return <header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label={`${SITE_NAME} home`}><span className="brand-mark"><CalculatorIcon size={19} /></span><span>{SITE_NAME}</span></Link><nav aria-label="Main navigation"><Link href="/home-loan-emi-calculator/">Home loan</Link><Link href="/car-loan-emi-calculator/">Car loan</Link><Link href="/personal-loan-emi-calculator/">Personal loan</Link></nav><ThemeToggle /></div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><Link className="brand" href="/"><span className="brand-mark"><CalculatorIcon size={19} /></span><span>{SITE_NAME}</span></Link><p>A clearer view of your next loan decision.</p></div><div className="footer-links"><div><strong>Calculators</strong><Link href="/home-loan-emi-calculator/">Home loan EMI</Link><Link href="/car-loan-emi-calculator/">Car loan EMI</Link><Link href="/personal-loan-emi-calculator/">Personal loan EMI</Link></div><div><strong>Information</strong><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy-policy/">Privacy policy</Link><Link href="/terms-of-service/">Terms of service</Link><Link href="/disclaimer/">Disclaimer</Link><AdPreferences /></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {SITE_NAME}. For planning and education.</span><a href={`mailto:${CONTACT_EMAIL}`}>Questions? Get in touch <ArrowUpRight size={14} /></a></div></footer>;
}
