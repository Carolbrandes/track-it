const localeMap: Record<string, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-ES',
};

function getIntlLocale(locale?: string): string {
    return localeMap[locale ?? 'en'] ?? 'en-US';
}

export const formatDate = (isoDate: string, locale?: string) => {
    const date = new Date(isoDate);
    const intlLocale = getIntlLocale(locale);

    return date.toLocaleDateString(intlLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

export function formatCurrency(amount: number, currency: string = 'USD', locale?: string): string {
    const intlLocale = getIntlLocale(locale);

    return new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatNumber(value: number, locale?: string): string {
    const intlLocale = getIntlLocale(locale);

    return new Intl.NumberFormat(intlLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function truncateText(text: string, maxLength: number = 20): string {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDateForInput(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
