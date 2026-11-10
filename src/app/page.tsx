import type { Metadata } from 'next';
import { Calculator } from '@/components/calculator';
import { Article, generalFaq, generalSections } from '@/components/content';
import { metadataFor, structuredData } from '@/lib/seo';
import { DEFAULT_DESCRIPTION } from '@/lib/config';

export const metadata: Metadata = metadataFor('Free EMI Calculator India — Home, Car & Personal Loan EMI', 'Free EMI calculator for India. Calculate home loan, car loan and personal loan EMI instantly. Get monthly instalment, total interest and full amortization schedule. No sign-up, 100% private.', '/');
const schema = structuredData('/', 'Free Loan EMI Calculator', DEFAULT_DESCRIPTION, generalFaq);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="utility-top-bar">
        <div className="utility-top-inner">
          <div className="tool-title-group">
            <h1>Loan EMI Calculator</h1>
            <p>Calculate your monthly loan payments, total interest and complete amortization schedule.</p>
          </div>
        </div>
      </div>

      <div className="main-wrap">
        <div className="calculator-wrapper">
          <Calculator />
        </div>
        <Article sections={generalSections} faq={generalFaq} />
      </div>
    </>
  );
}
