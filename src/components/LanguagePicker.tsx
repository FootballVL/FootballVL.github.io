import { Globe2 } from 'lucide-react';
import { languages } from '../i18n/languages';
import type { Language } from '../i18n/languages';
import { useI18n } from '../i18n/I18nProvider';

export function LanguagePicker() {
  const { language, setLanguage, t, loading, error } = useI18n();
  return <div className="language-picker" aria-busy={loading}>
    <label><Globe2 size={16} aria-hidden="true" /><span className="sr-only">{t('Language')}</span><select aria-label={t('Language')} value={language} disabled={loading} onChange={(event) => setLanguage(event.target.value as Language)}>{languages.map((item) => <option key={item.code} value={item.code} lang={item.code}>{item.name}</option>)}</select></label>
    {error && <p role="alert">{t('Unable to load this language. Please try again.')}</p>}
  </div>;
}
