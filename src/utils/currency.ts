const formatter = new Intl.NumberFormat('en-LK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const integerFormatter = new Intl.NumberFormat('en-LK', {
  maximumFractionDigits: 0,
});
export const formatCurrency = (value: number | string) => {
  // Preserve exact backend decimal strings, including large cart totals.
  if (typeof value === 'string' && /^\d+(\.\d{1,2})?$/.test(value)) {
    const [whole, fraction = ''] = value.split('.');
    return `LKR ${integerFormatter.format(BigInt(whole))}.${fraction.padEnd(2, '0')}`;
  }
  return `LKR ${formatter.format(Number(value))}`;
};
