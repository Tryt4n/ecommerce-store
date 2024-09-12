import type { DiscountCodeType } from "@prisma/client";

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

const PERCENT_FORMATTER = new Intl.NumberFormat("pl-PL", { style: "percent" });

export function formatDiscountCode(
  discountAmount: number,
  discountType: DiscountCodeType
) {
  switch (discountType) {
    case "PERCENTAGE":
      return PERCENT_FORMATTER.format(discountAmount / 100);
    case "FIXED":
      return formatCurrency(discountAmount);
    default:
      throw new Error(
        `Invalid discount code type: ${discountType satisfies never}`
      );
  }
}
