import dayjs from "dayjs";

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDueDate = (isoDate: string): string =>
  dayjs(isoDate).format("MM/DD/YYYY");
