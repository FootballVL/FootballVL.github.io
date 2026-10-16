export const euro = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export const compactEuro = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `EUR ${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}m`;
  if (Math.abs(value) >= 1_000) return `EUR ${(value / 1_000).toFixed(0)}k`;
  return euro.format(value);
};

export const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
