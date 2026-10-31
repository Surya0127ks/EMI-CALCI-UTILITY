'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const saved = localStorage.getItem('emicalc-theme') === 'dark'; setDark(saved); document.documentElement.classList.toggle('dark', saved); }, []);
  function toggle() { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('emicalc-theme', next ? 'dark' : 'light'); }
  return <button className="theme-toggle" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggle}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
