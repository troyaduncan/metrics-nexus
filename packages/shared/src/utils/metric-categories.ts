export const CATEGORIES = {
  throughput: "Throughput",
  errors: "Errors",
  latency: "Latency",
  health: "Health",
  saturation: "Saturation",
  dependencies: "Dependencies",
  domain: "Domain",
  events: "Events",
  sessions: "Sessions",
  logstreaming: "Log Streaming",
} as const;

export type Category = keyof typeof CATEGORIES;

export const COMPONENTS = {
  core: "CHA Core",
  access: "CHA Access",
  collector: "CHA Collector",
  snapshot_producer: "CHA Snapshot Producer",
  dlb: "CHA DLB",
  bca: "CHA BCA",
  nfreg: "CHA NF Registrator",
} as const;

export type Component = keyof typeof COMPONENTS;
