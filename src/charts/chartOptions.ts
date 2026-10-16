import type { EChartsOption } from 'echarts';
import type { PlayerValuation } from '../types';
import { compactEuro } from '../utils/format';

const text = '#59635C';
const ink = '#222925';
const line = '#D0D6CD';
const red = '#B6382E';
const green = '#28594E';
const grid = { left: 54, right: 22, top: 34, bottom: 54 };
const tooltipStyle = {
  backgroundColor: '#FAFBF8',
  borderColor: line,
  textStyle: { color: ink, fontFamily: 'IBM Plex Sans, sans-serif' },
  extraCssText: 'border-radius:0;box-shadow:0 4px 16px rgba(34,41,37,.12)',
};

export const baseChart = {
  backgroundColor: 'transparent',
  grid,
  textStyle: { color: text, fontFamily: 'IBM Plex Sans, sans-serif' },
  tooltip: { trigger: 'axis', ...tooltipStyle },
} satisfies EChartsOption;

export function barOption(labels: string[], values: number[], title?: string): EChartsOption {
  return {
    ...baseChart,
    grid: { left: '42%', right: 40, top: title ? 40 : 16, bottom: 35 },
    title: title ? { text: title, textStyle: { color: ink, fontSize: 14 } } : undefined,
    xAxis: { type: 'value', axisLabel: { color: text, fontSize: 10 }, splitLine: { lineStyle: { color: line, type: 'dotted' } } },
    yAxis: { type: 'category', inverse: true, data: labels, axisLabel: { color: ink, fontSize: 11, width: 125, overflow: 'truncate' }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: values, barMaxWidth: 15, itemStyle: { color: red }, label: { show: true, position: 'right', color: text, fontSize: 10, formatter: (params) => Number(params.value).toFixed(2) } }],
  };
}

export function metricOption(metrics: { model: string; r2: number; rmse: number }[]): EChartsOption {
  return {
    ...baseChart,
    grid: { ...grid, right: 45, bottom: 70, top: 55 },
    legend: { top: 0, textStyle: { color: text } },
    xAxis: { type: 'category', data: metrics.map((metric) => metric.model), axisLabel: { color: text, interval: 0, width: 85, overflow: 'break', fontSize: 10 }, axisLine: { lineStyle: { color: line } } },
    yAxis: [
      { type: 'value', name: 'R²', min: 0, max: 0.8, axisLabel: { color: text }, splitLine: { lineStyle: { color: line, type: 'dotted' } } },
      { type: 'value', name: 'RMSE (log)', min: 0, max: 1.2, axisLabel: { color: text }, splitLine: { show: false } },
    ],
    series: [
      { name: 'R²', type: 'bar', data: metrics.map((metric) => metric.r2), barMaxWidth: 42, itemStyle: { color: red } },
      { name: 'RMSE (log)', type: 'line', yAxisIndex: 1, data: metrics.map((metric) => metric.rmse), symbolSize: 8, lineStyle: { color: green }, itemStyle: { color: green } },
    ],
  };
}

export function valuationScatter(players: PlayerValuation[]): EChartsOption {
  const max = Math.max(1, ...players.flatMap((player) => [player.observedValue, player.estimatedValue]));
  return {
    ...baseChart,
    tooltip: {
      trigger: 'item',
      ...tooltipStyle,
      formatter: (event) => {
        const params = event as { dataIndex: number; seriesIndex: number };
        const player = players[params.dataIndex];
        if (params.seriesIndex !== 1 || !player) return '';
        return `<strong>${player.name}</strong><br/>Observed: ${compactEuro(player.observedValue)}<br/>Estimated: ${compactEuro(player.estimatedValue)}<br/>Difference: ${compactEuro(player.difference)}`;
      },
    },
    xAxis: {
      type: 'value', name: 'Observed value', nameLocation: 'middle', nameGap: 36,
      axisLabel: { color: text, fontSize: 10, formatter: (value: number) => compactEuro(value).replace('EUR ', '') },
      splitLine: { lineStyle: { color: line, type: 'dotted' } },
    },
    yAxis: {
      type: 'value', name: 'Estimated value',
      axisLabel: { color: text, fontSize: 10, formatter: (value: number) => compactEuro(value).replace('EUR ', '') },
      splitLine: { lineStyle: { color: line, type: 'dotted' } },
    },
    series: [
      { type: 'line', data: [[0, 0], [max, max]], symbol: 'none', lineStyle: { color: '#8A948B', type: 'dashed' }, silent: true },
      {
        type: 'scatter', data: players.map((player) => [player.observedValue, player.estimatedValue]),
        symbolSize: (value: number[]) => Math.max(8, Math.min(28, Math.sqrt(value[0]) / 420)),
        itemStyle: { color: (params) => players[params.dataIndex].difference >= 0 ? green : red, opacity: .9 },
      },
    ],
  };
}
