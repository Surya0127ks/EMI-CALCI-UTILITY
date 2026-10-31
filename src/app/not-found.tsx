import Link from 'next/link';
export default function NotFound() {
  return <section className="legal-page"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>That page isn’t here.</h1><p className="legal-lead">The address may have changed or the page may have been removed.</p><Link className="button button-primary" href="/">Return to the EMI calculator</Link></section>;
}
