import { z } from "zod";

export const TimeRangePreset = z.enum([
  "5m",
  "15m",
  "1h",
  "6h",
  "12h",
  "24h",
  "2d",
  "7d",
  "30d",
  "custom",
]);
export type TimeRangePreset = z.infer<typeof TimeRangePreset>;

export const REFRESH_INTERVALS = [
  { value: 0, label: "Off" },
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1m" },
  { value: 300, label: "5m" },
  { value: 900, label: "15m" },
  { value: 1800, label: "30m" },
  { value: 3600, label: "1h" },
  { value: 7200, label: "2h" },
  { value: 86400, label: "1d" },
] as const;

export const TimeRangeSchema = z.object({
  preset: TimeRangePreset,
  start: z.number().optional(),
  end: z.number().optional(),
  stepSeconds: z.number().optional(),
});
export type TimeRange = z.infer<typeof TimeRangeSchema>;

export const GlobalFilterSchema = z.object({
  cluster: z.string().optional(),
  region: z.string().optional(),
  service: z.string().optional(),
  instance: z.string().optional(),
  pod: z.string().optional(),
});
export type GlobalFilter = z.infer<typeof GlobalFilterSchema>;
