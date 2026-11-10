import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from '@/components/calculator';
import { Article, type Faq, type Section } from '@/components/content';
import { metadataFor, structuredData } from '@/lib/seo';
const title = 'Car Loan EMI Calculator';
const description = 'Free car loan EMI calculator India. Calculate monthly car loan EMI, total interest and amortization schedule. Compare vehicle loan terms and down-payment scenarios instantly.';
export const metadata: Metadata = metadataFor(`${title} — Calculate Car EMI Free`, description, '/car-loan-emi-calculator/');
const faq: Faq[] = [
  { q: 'Should I enter the car price or loan amount?', a: 'Enter the amount you plan to borrow after the down payment. Add-on products or financed fees may change the principal.' },
  { q: 'Are running costs included in the EMI?', a: 'No. Fuel, maintenance, registration, taxes and insurance are separate ownership costs. Budget for them in addition to installments.' },
  { q: 'How can I lower a car loan EMI?', a: 'Consider borrowing less, comparing lender rates, making a larger down payment or choosing a longer term while checking its total interest cost.' },
  { q: 'Does a longer car loan cost more?', a: 'It often lowers the scheduled payment but increases total interest because the principal remains outstanding longer.' },
  { q: 'Can I pay off my car loan early?', a: 'Possibly. Check the agreement for prepayment eligibility, fees, minimum amounts and how an extra payment is applied.' },
  { q: 'Is the rate fixed for the entire loan?', a: 'That depends on your contract. Confirm whether it is fixed or variable and how a rate change affects installments.' },
  { q: 'How does the calculator estimate interest?', a: 'It applies a monthly reducing-balance formula to the principal, annual rate and number of payments.' },
  { q: 'Does this guarantee loan approval?', a: 'No. This tool only estimates payments. Lenders determine approval, rate and terms after their own application review.' }
];
const sections: Section[] = [
  { title: 'Estimate the payment before choosing a car', paragraphs: ['A car loan makes a vehicle purchase easier to spread over time, but the monthly installment is only one part of the cost. Use this calculator to test the amount financed, annual rate and repayment term before settling on a budget. The example starts at 1,500,000, 9% and five years; replace each value with the figures in your offer or quotation.', 'Start with the amount you will actually borrow. Subtract your down payment or trade-in value from the vehicle price, then add any items the lender allows you to finance. Registration charges, taxes, insurance, accessories and dealer fees may be due separately or added to the loan. Ask for a clear breakdown so the principal is accurate.'] },
  { title: 'How car loan EMI is calculated', paragraphs: ['For a fixed monthly payment on a reducing-balance loan, the calculator uses EMI = P × r × (1+r)^n / ((1+r)^n − 1). P is the amount borrowed, r is the monthly decimal interest rate and n is the number of monthly installments. Convert the annual percentage by dividing by 1,200. When the rate is zero, the monthly payment is principal divided by months.', 'As a rounded illustration, borrowing 1,500,000 at 9% annually for 60 months produces a payment near 31,135 monthly. Total payments are close to 1,868,000, so modeled interest is about 368,000. Exact results depend on rounding, payment dates and the lender’s calculation method. The schedule shows the estimated amount allocated to principal, interest and remaining balance each month.'] },
  { title: 'Compare rate, term and total ownership budget', paragraphs: ['The annual interest rate has a direct effect on the installment and total borrowing cost. Compare the effective rate, fees, required insurance and whether the rate can reset. A flat-rate quote may calculate interest using the original principal throughout, while a reducing-balance loan charges against the unpaid amount. Ask the lender which method applies before comparing percentages.', 'A longer term can make the car payment appear more manageable, but it usually increases total interest and may leave you owing more than the vehicle is worth for longer. A shorter term costs more each month but typically clears principal faster. Balance the loan payment with insurance, fuel or charging, servicing, repairs and depreciation. A payment that fits only before those expenses may not be sustainable.', 'Try a few scenarios with one changed variable at a time. A larger down payment reduces principal. A lower rate can reduce both EMI and lifetime interest. Moving from five to six years may reduce the scheduled monthly amount but usually increases total paid. Focus on the full ownership budget, not only the number shown in an advertisement.'] },
  { title: 'Prepayment and a smarter purchase plan', paragraphs: ['Extra principal payments can reduce the balance earlier and lower interest over the remaining term. Use the monthly or one-time extra payment controls to explore the possible savings. The model assumes the lender accepts the full extra amount as principal without a penalty. Some auto loans restrict early settlement, charge fees or recalculate the installment instead of shortening the term.', 'Before committing, request a written amortization schedule and ask about early repayment, late fees, rate type, balloon or residual payments and any final settlement amount. Check whether dealer incentives require financing through a particular lender and compare the complete cost against outside offers. Keep a reasonable savings buffer rather than putting every available amount toward a down payment.', 'This tool is for planning, not a quote or approval. Use the downloadable schedule for personal comparison and confirm the exact repayment terms directly with the lender. A disciplined comparison can help you choose a vehicle and loan that leave room for the rest of your monthly priorities.', 'It is useful to test a few realistic purchase prices before visiting a showroom. A slightly less expensive model, a carefully chosen used vehicle or a larger deposit can change the required principal far more than a small adjustment to the repayment term. Compare the estimated interest saved with the cash you would need to keep available for maintenance and emergencies. If you trade in a vehicle, check whether any outstanding balance is being added to the new financing; rolling old debt into a new agreement increases the amount on which interest is charged.'] }
];
export default function CarLoanPage() {
  const schema = structuredData('/car-loan-emi-calculator/', title, description, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="utility-top-bar">
        <div className="utility-top-inner">
          <div className="tool-title-group">
            <h1>Car Loan EMI Calculator</h1>
            <p>Calculate your vehicle loan monthly payments, interest and down-payment scenarios.</p>
          </div>
        </div>
      </div>
      <div className="main-wrap">
        <div className="calculator-wrapper">
          <Calculator preset={{ amount: 1500000, rate: 9, years: 5, currency: 'INR' }} />
        </div>
        <Article title="A practical guide to car loan EMI" sections={sections} faq={faq} />
      </div>
    </>
  );
}
