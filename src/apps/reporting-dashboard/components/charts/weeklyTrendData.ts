export type WeeklyTrendDatum = {
  week: string;
  total: number;
  sampled: number;
};

/** Mock data — `total` + `sampled` equals the label shown on each bar. */
export const weeklyTrendData: WeeklyTrendDatum[] = [
  { week: "W1", total: 39, sampled: 17 },
  { week: "W2", total: 36, sampled: 21 },
  { week: "W3", total: 41, sampled: 15 },
  { week: "W4", total: 58, sampled: 26 },
  { week: "W5", total: 42, sampled: 17 },
  { week: "W6", total: 52, sampled: 35 },
  { week: "W7", total: 22, sampled: 9 },
  { week: "W49", total: 48, sampled: 20 },
  { week: "W50", total: 72, sampled: 38 },
  { week: "W51", total: 78, sampled: 41 },
  { week: "W52", total: 45, sampled: 17 },
  { week: "W53", total: 48, sampled: 18 },
];

export const WEEKLY_TREND_COLORS = {
  total: "#27ae60",
  sampled: "#fbbd33",
} as const;
