const formatter = new Intl.NumberFormat('en-LK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const formatCurrency = (value: number | string) =>
  `LKR ${formatter.format(Number(value))}`;
