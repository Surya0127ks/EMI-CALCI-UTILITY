'use client';
import { useEffect, useState } from 'react';

/** Consent is stored locally and can be changed by clearing site data. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const sync = () => setVisible(!localStorage.getItem('emicalc-consent'));
    sync(); window.addEventListener('emicalc-open-consent', sync);
    return () => window.removeEventListener('emicalc-open-consent', sync);
  }, []);
  function choose(value: 'accepted' | 'rejected') {
    localStorage.setItem('emicalc-consent', value); setVisible(false);
    window.dispatchEvent(new Event('emicalc-consent-change'));
  }
  if (!visible) return null;
  return <section className="consent" role="dialog" aria-label="Cookie and advertising preferences"><div><strong>Your privacy matters</strong><p>We use essential local storage for your preferences. Advertising cookies are only enabled if you accept. <a href="/privacy-policy/">Privacy policy</a>.</p></div><div className="consent-actions"><button className="button button-muted" onClick={() => choose('rejected')}>Reject</button><button className="button button-primary" onClick={() => choose('accepted')}>Accept</button></div></section>;
}
