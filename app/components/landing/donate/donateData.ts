import { CurrencyCode } from "@/app/redux/types";

export const currencyInfo: Record<
  CurrencyCode,
  { symbol: string; suggestions: Array<number>; minAmount: number }
> = {
  ngn: {
    symbol: "₦",
    suggestions: [1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000],
    minAmount: 1_000,
  },
  usd: {
    symbol: "$",
    suggestions: [1, 2, 5, 10, 20, 50, 100, 200],
    minAmount: 1,
  },
  gbp: {
    symbol: "£",
    suggestions: [1, 2, 5, 10, 20, 50, 100, 200],
    minAmount: 1,
  },
};

export const currencyCodes: Array<CurrencyCode> = ["ngn", "gbp", "usd"];