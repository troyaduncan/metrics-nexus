export interface ComponentInfo {
  id: string;
  name: string;
  prefix: string;
  description: string;
  docRef: string;
}

export const CHA_COMPONENTS: ComponentInfo[] = [
  {
    id: "core",
    name: "CHA Core",
    prefix: "cha_core_",
    description:
      "Core charging engine handling rating, balance operations, policy control, events, sessions, and DNS lookups.",
    docRef: "517/1553-CSH 109 900 Uen",
  },
  {
    id: "access",
    name: "CHA Access",
    prefix: "cha_access_",
    description:
      "Access layer handling HTTP/Diameter interfaces, NCHF charging, event consumption, and overload protection.",
    docRef: "518/1553-CSH 109 900 Uen",
  },
  {
    id: "collector",
    name: "CHA Collector",
    prefix: "cha_collector_",
    description:
      "Collector component for balance operations, deferred RAC processing, settlement triggers, and partner resources.",
    docRef: "698/1553-CSH 109 900 Uen",
  },
  {
    id: "snapshot_producer",
    name: "CHA Snapshot Producer",
    prefix: "cha_snapshot_producer_",
    description:
      "Snapshot producer for balance snapshots (customer, contract, partner), CIL/COBA/RMCA data management, and event posting.",
    docRef: "839/1553-CSH 109 900 Uen",
  },
  {
    id: "dlb",
    name: "CHA DLB",
    prefix: "cha_dlb_",
    description:
      "Diameter Load Balancer for distributing Diameter protocol traffic.",
    docRef: "519/1553-CSH 109 900 Uen",
  },
  {
    id: "bca",
    name: "CHA BCA",
    prefix: "cha_bca_",
    description:
      "Business Configuration Agent for managing business configuration and capabilities.",
    docRef: "520/1553-CSH 109 900 Uen",
  },
  {
    id: "nfreg",
    name: "CHA NF Registrator",
    prefix: "cha_nfreg_",
    description:
      "NF Registrator for NRF registration, updates, heartbeats, and OAuth token management.",
    docRef: "521/1553-CSH 109 900 Uen",
  },
];
