import { format, addWeeks, addMonths } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'MMM d, yyyy');
export const addReviewDate = (frequency: string) => {
  const now = new Date();
  switch (frequency) {
    case '1 week':
      return addWeeks(now, 1);
    case '2 weeks':
      return addWeeks(now, 2);
    case '1 month':
      return addMonths(now, 1);
    case '3 months':
      return addMonths(now, 3);
    case '6 months':
      return addMonths(now, 6);
    default:
      return addMonths(now, 1);
  }
};