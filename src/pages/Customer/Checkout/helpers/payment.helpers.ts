import { formatMinorUnits, parseMinorUnits } from '../../../../utils/currency';

export function checkoutCredit(
  enabled: boolean,
  amount: string,
  balance: string,
  subtotal: string,
) {
  const total = parseMinorUnits(subtotal) ?? 0n;
  const available = parseMinorUnits(balance) ?? 0n;
  const requested = enabled ? parseMinorUnits(amount) : 0n;
  const valid =
    requested !== null && requested <= available && requested <= total;
  const applied = valid ? requested : 0n;
  return {
    valid,
    amount: formatMinorUnits(applied),
    remaining: formatMinorUnits(total - applied),
  };
}
