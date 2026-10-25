const formatter = new Intl.NumberFormat('en-LK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const integerFormatter = new Intl.NumberFormat('en-LK', {
  maximumFractionDigits: 0,
});
export function parseMinorUnits(value: string): bigint | null {
  if (!/^\d{1,28}(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
}
export function formatMinorUnits(value: bigint): string {
  return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}
export const formatCurrency = (value: number | string) => {
  // Preserve exact backend decimal strings, including large cart totals.
  if (typeof value === 'string' && /^\d+(\.\d{1,2})?$/.test(value)) {
    const [whole, fraction = ''] = value.split('.');
    return `LKR ${integerFormatter.format(BigInt(whole))}.${fraction.padEnd(2, '0')}`;
  }
  return `LKR ${formatter.format(Number(value))}`;
};
