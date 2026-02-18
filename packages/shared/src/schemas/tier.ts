import { z } from "zod";

export const TierLevel = z.enum(["tier1", "tier2", "tier3"]);
export type TierLevel = z.infer<typeof TierLevel>;

export const TierConfigSchema = z.object({
  tier1: z.array(z.string()),
  tier2: z.array(z.string()),
  tier3: z.array(z.string()),
});
export type TierConfig = z.infer<typeof TierConfigSchema>;
