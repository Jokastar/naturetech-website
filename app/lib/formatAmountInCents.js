export default function formatAmountInCents(amount, locale = 'fr-FR', currency = 'EUR') {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    });

    // Format the amount in euros
    const formattedAmount = formatter.format(amount);

    return formattedAmount;
}

