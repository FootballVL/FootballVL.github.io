import { useEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { figureLabels } from '../i18n/figureLabels';
import type { FigureLabel } from '../i18n/figureLabels';
import { useI18n } from '../i18n/I18nProvider';

function Label({ label }: { label: FigureLabel }) {
  const { t, language } = useI18n();
  const ref = useRef<SVGTextElement>(null);
  const [length, setLength] = useState<number>();
  const text = t(label.text);
  useEffect(() => {
    const measure = () => {
      const element = ref.current;
      if (!element) return;
      element.removeAttribute('textLength');
      const width = element.getComputedTextLength();
      const next = width > label.width ? label.width : undefined;
      if (next) element.setAttribute('textLength', String(next));
      setLength(next);
    };
    measure(); void document.fonts.ready.then(measure);
  }, [text, label.width]);
  return <text ref={ref} x={label.x} y={label.y} textAnchor={label.anchor ?? 'middle'} dominantBaseline="central" fontSize={label.size ?? 24} fontWeight={label.y === 30 || label.y === 82 ? 600 : 400} transform={label.rotate ? `rotate(${label.rotate} ${label.x} ${label.y})` : undefined} textLength={length} lengthAdjust="spacingAndGlyphs" lang={language} direction="ltr">{text}</text>;
}

export function LocalizedResearchFigure({ src, title }: { src: string; title: string }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const number = Number(src.match(/figure-(\d+)/)?.[1]);
  const annotations = figureLabels(number);
  const url = `${import.meta.env.BASE_URL}${src}`;
  useEffect(() => { if (expanded) dialog.current?.showModal(); else dialog.current?.close(); }, [expanded]);
  const drawing = () => <svg className="translated-figure" viewBox="0 0 1344 960" role="img" aria-label={t(title)} xmlns="http://www.w3.org/2000/svg">
    <title>{t(title)}</title><desc>{t('Original plot and numeric values preserved. Titles, axes and category labels are translated.')}</desc>
    <image href={url} width="1344" height="960" />
    {annotations?.masks.map((mask, index) => <rect key={`mask-${index}`} {...mask} fill="white" />)}
    <g fill="#222925" fontFamily="Arial, sans-serif">{annotations?.labels.map((label, index) => <Label key={index} label={label} />)}</g>
  </svg>;
  return <figure className="original-figure localised-source-figure">
    {drawing()}
    <figcaption><span>{t('Original data layer · translated annotations')}</span><button type="button" onClick={() => setExpanded(true)} aria-label={t('Open full-size translated figure')}><Maximize2 size={14} />{t('Full size')}</button><a href={url} target="_blank" rel="noreferrer">{t('Spanish original')}</a></figcaption>
    <dialog ref={dialog} className="figure-dialog" onCancel={() => setExpanded(false)} onClick={(event) => { if (event.target === dialog.current) setExpanded(false); }}>
      <div className="figure-dialog-toolbar"><span>{t(title)}</span><button type="button" onClick={() => setExpanded(false)} aria-label={t('Close figure')}><X size={22} /></button></div>
      {expanded && drawing()}
    </dialog>
  </figure>;
}
