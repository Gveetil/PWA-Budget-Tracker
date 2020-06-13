
export function formatCurrency(value) {
    if (!value)
        return "";

    return value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}