import axios from 'axios';

interface ApiErrorBody {
  message?: string | string[];
}

export const getStockUpdateErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return 'Something went wrong. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;

  switch (status) {
    case 400: {
      const message = data?.message;

      if (Array.isArray(message)) {
        return message.join(' ');
      }

      return message ?? 'The stock quantity is not valid.';
    }

    case 401:
      return 'Your session has expired. Please log in again.';

    case 403:
      return 'Access denied. Only administrators can update stock.';

    case 404:
      return 'Product not found.';

    default:
      return 'Unable to update stock. Please try again.';
  }
};
