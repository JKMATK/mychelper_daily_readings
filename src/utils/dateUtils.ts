/**
 * Format a Date object to YYYY-MM-DD string format
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayISO = (): string => {
  return formatDateToISO(new Date());
};

/**
 * Validate if a string is a valid date in YYYY-MM-DD format
 */
export const isValidDateString = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Parse a date string and return a Date object
 */
export const parseDateString = (dateString: string): Date => {
  if (!isValidDateString(dateString)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  
  return new Date(dateString);
}; 