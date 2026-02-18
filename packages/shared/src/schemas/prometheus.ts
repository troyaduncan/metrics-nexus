import { z } from "zod";

const MetricValueSchema = z.tuple([z.number(), z.string()]);

const InstantVectorSampleSchema = z.object({
  metric: z.record(z.string()),
  value: MetricValueSchema,
});

export const InstantVectorResultSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    resultType: z.literal("vector"),
    result: z.array(InstantVectorSampleSchema),
  }),
});
export type InstantVectorResult = z.infer<typeof InstantVectorResultSchema>;

const RangeVectorSampleSchema = z.object({
  metric: z.record(z.string()),
  values: z.array(MetricValueSchema),
});

export const RangeVectorResultSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    resultType: z.literal("matrix"),
    result: z.array(RangeVectorSampleSchema),
  }),
});
export type RangeVectorResult = z.infer<typeof RangeVectorResultSchema>;

export const LabelValuesResultSchema = z.object({
  status: z.literal("success"),
  data: z.array(z.string()),
});
export type LabelValuesResult = z.infer<typeof LabelValuesResultSchema>;

export const PromErrorSchema = z.object({
  status: z.literal("error"),
  errorType: z.string(),
  error: z.string(),
});
export type PromError = z.infer<typeof PromErrorSchema>;
