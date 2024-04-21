export function eurosToCents(amountInEuros) {
    // Convert Euros to cents
    const amountInCents = amountInEuros * 100;
  
    // Round to avoid floating point precision issues
    return Math.round(amountInCents);
  }

  export function formattedCurrency(amountInCents, currencySymbol = '€') {
    // Convert cents to Euros
    const amountInEuros = amountInCents / 100;
  
    // Format amount with 2 decimal places and currency symbol
    const formattedAmount = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amountInEuros);
  
    return formattedAmount;
  }
  
  // Example usage:
  const amountInCents = 2050;  // 20.50 Euros
  const formattedAmount = formattedCurrency(amountInCents);
  
  console.log(`Formatted Amount: ${formattedAmount}`);
  

