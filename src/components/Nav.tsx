import { Localized } from '../i18n/I18nProvider';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navItems } from '../content/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { LanguagePicker } from './LanguagePicker';

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(navItems.map((item) => item.id));

  return <Localized>{(
    <header className="site-nav sticky top-0 z-50 border-b border-line">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4" aria-label="Primary navigation" dir="ltr">
        <a href="#hero" className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-ink">
          <span className="brand-stamp" aria-hidden="true">FV<span>L</span></span>
          Football Value Lab
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={`border-b px-3 py-2 text-sm transition ${active === item.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-utilities"><a className="resources-link items-center gap-2 text-sm text-muted hover:text-ink" href="#research">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          Resources
        </a>
        <LanguagePicker /></div>
        <button type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="p-2 text-muted md:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="grid grid-cols-3 gap-2 border-t border-line px-5 py-4 md:hidden">{navItems.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} aria-current={active === item.id ? 'location' : undefined} className={`py-2 text-sm ${active === item.id ? 'text-accent' : 'text-muted'}`}>{item.label}</a>)}</nav>}
    </header>
  )}</Localized>;
}
