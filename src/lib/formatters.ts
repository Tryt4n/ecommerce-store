const CURRENCY_FORMATTER = new Intl.NumberFormat("pl-PL", {
  currency: "PLN",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("pl-PL");

export function formatNumber(amount: number) {
  return NUMBER_FORMATTER.format(amount);
}

export function dateFormatter(date: Date | number) {
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(date);
}
