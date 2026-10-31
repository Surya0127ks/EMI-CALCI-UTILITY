'use client';
import { useEffect, useState } from 'react';

/** Ads are only requested after affirmative consent; the reserved space limits layout shift. */
export function AdLoader() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () => setAllowed(localStorage.getItem('emicalc-consent') === 'accepted');
    sync();
    window.addEventListener('emicalc-consent-change', sync);
    return () => window.removeEventListener('emicalc-consent-change', sync);
  }, []);
  useEffect(() => {
    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    if (!allowed || !client || !/^ca-pub-\d{16}$/.test(client) || document.querySelector('[data-adsense-loader]')) return;
    const script = document.createElement('script');
    script.async = true; script.dataset.adsenseLoader = 'true';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [allowed]);
  return null;
}

export function AdSlot({ slot, format = 'auto' }: { slot: string; format?: string }) {
  const [allowed, setAllowed] = useState(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const configuredSlot = /^\d{10}$/.test(slot);
  useEffect(() => {
    const sync = () => setAllowed(localStorage.getItem('emicalc-consent') === 'accepted');
    sync(); window.addEventListener('emicalc-consent-change', sync);
    return () => window.removeEventListener('emicalc-consent-change', sync);
  }, []);
  useEffect(() => {
    if (!allowed || !client || !/^ca-pub-\d{16}$/.test(client) || !configuredSlot) return;
    // AdSense supports a queued push while its async script finishes loading.
    const queue = window.adsbygoogle ?? [];
    window.adsbygoogle = queue;
    queue.push({});
  }, [allowed, client, configuredSlot, slot]);
  return <aside className="ad-slot" aria-label="Advertisement"><span>Advertisement</span>{allowed && client && configuredSlot && <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />}</aside>;
}

declare global { interface Window { adsbygoogle?: Array<Record<string, unknown>>; } }
