import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { languages } from './languages';
import type { Language, Messages, Translate } from './languages';
import english from './locales/en.json';
import protectedNames from './protected.json';

const loaders = import.meta.glob<{ default: Messages }>(['./locales/*.json', '!./locales/en.json']);
const protectedSet = new Set<string>(protectedNames);
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function makeTranslator(messages: Messages): Translate {
  const keys = Object.keys(messages).filter((key) => key.length >= 3 && messages[key] !== key).sort((a, b) => b.length - a.length);
  const fragments = keys.length ? new RegExp(`(?<![\\p{L}\\p{N}_])(?:${keys.map(escapeRegex).join('|')})(?![\\p{L}\\p{N}_])`, 'gu') : null;
  return (value) => {
    const key = normalize(value);
    if (!key || protectedSet.has(key)) return value;
    const translated = messages[key];
    if (translated != null) return `${value.match(/^\s*/)?.[0] ?? ''}${translated}${value.match(/\s*$/)?.[0] ?? ''}`;
    // Composite accessibility labels combine protected names, labels and values.
    return fragments ? value.replace(fragments, (part) => messages[part] ?? part) : value;
  };
}

interface I18nContextValue { language: Language; t: Translate; loading: boolean; error: boolean; setLanguage: (language: Language) => void; }
const Context = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Messages>(english);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const t = useMemo(() => makeTranslator(messages), [messages]);

  const setLanguage = async (next: Language) => {
    setLoading(true); setError(false);
    try {
      const nextMessages = next === 'en' ? english : (await loaders[`./locales/${next}.json`]()).default;
      setMessages(nextMessages); setCurrentLanguage(next);
      try { localStorage.setItem('fvl-language', next); } catch { /* Storage may be disabled. */ }
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fvl-language');
      if (languages.some((item) => item.code === saved) && saved !== 'en') void setLanguage(saved as Language);
    } catch { /* English remains available when storage is disabled. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = `Football Value Lab | ${t('Beyond the Price Tag')}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('Football Value Lab is an interactive data science portfolio case study on historical football market valuations.'));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t('Football Value Lab is an interactive data science portfolio case study on historical football market valuations.'));
  }, [language, t]);

  return <Context.Provider value={{ language, t, loading, error, setLanguage }}>{children}</Context.Provider>;
}

export function useI18n() {
  const value = useContext(Context);
  if (!value) throw new Error('Language provider is required.');
  return value;
}

function translateTree(node: ReactNode, t: Translate, language: Language, preserve = false): ReactNode {
  if (typeof node === 'string') return preserve ? node : t(node);
  if (Array.isArray(node)) return Children.map(node, (child) => translateTree(child, t, language, preserve));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const props = element.props;
  const updates: Record<string, unknown> = {};
  const canonicalCode = preserve || element.type === 'pre' || element.type === 'code' || props.translate === 'no';
  for (const key of ['aria-label', 'aria-roledescription', 'ariaLabel', 'placeholder', 'title', 'alt', 'eyebrow']) {
    if (typeof props[key] === 'string') updates[key] = t(props[key] as string);
  }
  if (props.lang && !canonicalCode) updates.lang = language;
  if (element.type === 'option' && props.value == null) updates.value = typeof props.children === 'string' ? props.children : undefined;
  if ('children' in props) updates.children = translateTree(props.children as ReactNode, t, language, canonicalCode);
  return cloneElement(element, updates);
}

/** Translate React presentation nodes, never data records or filter values. */
export function Localized({ children }: { children: ReactNode }) {
  const { t, language } = useI18n();
  return <>{translateTree(children, t, language)}</>;
}
