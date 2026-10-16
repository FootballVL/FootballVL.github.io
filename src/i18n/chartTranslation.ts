import type { EChartsOption } from 'echarts';
import type { Translate } from './languages';

function translateMarkup(value: string, t: Translate) {
  return value.split(/(<[^>]*>)/g).map((part) => part.startsWith('<') ? part : t(part)).join('');
}

export function translateChartOption(option: EChartsOption, t: Translate): EChartsOption {
  const visit = (value: unknown, key = ''): unknown => {
    if (typeof value === 'string') return ['name', 'text', 'subtext', 'data'].includes(key) ? t(value) : value;
    if (typeof value === 'function') return key === 'formatter' ? (...args: unknown[]) => { const output = value(...args); return typeof output === 'string' ? translateMarkup(output, t) : output; } : value;
    if (Array.isArray(value)) return value.map((entry) => visit(entry, key));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([property, entry]) => [property, visit(entry, property)]));
    return value;
  };
  return visit(option) as EChartsOption;
}
