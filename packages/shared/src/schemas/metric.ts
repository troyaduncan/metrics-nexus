import { z } from "zod";

export const MetricTypeEnum = z.enum([
  "counter",
  "gauge",
  "histogram",
  "summary",
  "unknown",
]);
export type MetricType = z.infer<typeof MetricTypeEnum>;

export const AudienceEnum = z.enum(["NOC", "SRE", "ENG"]);
export type Audience = z.infer<typeof AudienceEnum>;

export const ConfidenceEnum = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof ConfidenceEnum>;

export const MetricLabelSchema = z.object({
  key: z.string(),
  description: z.string().optional(),
  possibleValues: z.array(z.string()).optional(),
});
export type MetricLabel = z.infer<typeof MetricLabelSchema>;

export const MetricSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  unit: z.string().optional(),
  type: MetricTypeEnum,
  labels: z.array(MetricLabelSchema),
  category: z.string(),
  component: z.string(),
  audience: z.array(AudienceEnum),
  examples: z
    .array(z.object({ promql: z.string(), note: z.string().optional() }))
    .optional(),
  sourceRef: z
    .object({
      docName: z.string().optional(),
      section: z.string().optional(),
    })
    .optional(),
  confidence: ConfidenceEnum,
});
export type Metric = z.infer<typeof MetricSchema>;
