export const MAX_STOCK_QUANTITY = 2147483647;

export type StockValidationResult =
  | { valid: true; value: number }
  | { valid: false; message: string };

export const validateStockQuantity = (
  input: string,
): StockValidationResult => {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { valid: false, message: 'Enter a stock quantity.' };
  }

  if (/^-\d+(\.\d+)?$/.test(trimmed)) {
    return { valid: false, message: 'Stock cannot be negative.' };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      message: 'Stock must be a whole number, 0 or more.',
    };
  }

  const value = Number(trimmed);

  if (value > MAX_STOCK_QUANTITY) {
    return {
      valid: false,
      message: `Stock cannot be more than ${MAX_STOCK_QUANTITY.toLocaleString()}.`,
    };
  }

  return { valid: true, value };
};
