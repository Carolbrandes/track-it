/**
 * Formats a date string or Date object into a localized date string
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (isoDate: string) => {

    const date = new Date(isoDate);

    const dateFormatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });


    return dateFormatted
};

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$1,000.00")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Formats a number as a simple number with 2 decimal places
 * @param value - The number to format
 * @returns Formatted number string (e.g., "1,000.00")
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Shortens long text with an ellipsis
 * @param text - The text to shorten
 * @param maxLength - Maximum length before truncation
 * @returns Shortened text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 20): string {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a date for input[type="date"] fields
 * @param date - Date string or Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}