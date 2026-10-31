'use client';
/** Gives visitors a persistent way to reopen the advertising choice. */
export function AdPreferences() { return <button className="preference-link" onClick={() => { localStorage.removeItem('emicalc-consent'); window.dispatchEvent(new Event('emicalc-open-consent')); }}>Ad preferences</button>; }
