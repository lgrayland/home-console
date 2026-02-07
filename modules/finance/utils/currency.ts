export function formatCurrency(amountInPence: number): string {
  const amountInEuros = amountInPence / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(amountInEuros);
}
