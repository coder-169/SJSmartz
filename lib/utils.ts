import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatCurrencyProps = {
  currency?: string;
};

export const formatCurrency = (
  amount: number,
  options?: FormatCurrencyProps,
) => {
  const { currency = "PKR" } = options || {};

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatRating = (ratings: number) => {
  return Array.from(
    { length: ratings >= 5 ? 5 : ratings },
    (_, idx) => idx + 1,
  );
};
export const createSlug = (title: string) => {
  return title
    .toLowerCase() // Convert the string to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
};

export const formattedDate = (isoDate:string) => {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long", // or "short" for abbreviated month names
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // For AM/PM format
  });
};
