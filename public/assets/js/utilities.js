
export function formatCurrency(value) {
    if (value === null)
        return "";

    return value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumSignificantDigits: 1,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}