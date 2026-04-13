import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (p) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const statusColor = (status) => {
  const map = { pending: "badge-pending", approved: "badge-approved", confirmed: "badge-approved", rejected: "badge-rejected", cancelled: "badge-rejected", shipped: "badge-shipped", delivered: "badge-delivered", paid: "badge-approved", failed: "badge-rejected" };
  return map[status?.toLowerCase()] || "badge-pending";
};

export const truncate = (str, n = 60) => str?.length > n ? str.slice(0, n) + "..." : str;
