import { z } from "zod";

export const TimeRangePreset = z.enum([
  "15m",
  "1h",
  "6h",
  "24h",
  "7d",
  "custom",
]);
export type TimeRangePreset = z.infer<typeof TimeRangePreset>;

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
