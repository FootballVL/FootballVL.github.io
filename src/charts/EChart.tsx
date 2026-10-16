import { useEffect, useRef } from 'react';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

interface EChartProps {
  option: EChartsOption;
  height?: number;
  ariaLabel: string;
  onClick?: (params: unknown) => void;
}

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

export function EChart({ option, height = 360, ariaLabel, onClick }: EChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: 'canvas' });
    chart.setOption(option);
    if (onClick) chart.on('click', onClick);
    const resize = () => chart.resize();
    const observer = new ResizeObserver(resize);
    observer.observe(ref.current);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      chart.dispose();
    };
  }, [option, onClick]);

  return <div ref={ref} role="img" aria-label={ariaLabel} style={{ height, minWidth: 0 }} className="w-full" />;
}
