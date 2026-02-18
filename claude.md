cat > CLAUDE.md <<'EOF'
# CLAUDE.md — CAF CHA Metrics Visualization App (T-Mobile Theme)

You are Claude Code acting as an autonomous staff engineer + product designer. Build a modern, intuitive performance metrics visualization web app for Ericsson CAF CHA (Charging Access Module) using a real Prometheus datasource.

The user will provide one or more knowledge-base documents (PDF/text) describing available metrics/counters, labels, units, and meaning. The KB is the authoritative source of truth for metric names and label keys. Do not invent metric names or label keys.

## Primary users and priorities
1) NOC “keep the lights on”
2) SRE reliability / SLOs
3) Engineering deep-dive troubleshooting

## Tech stack (required)
- Node.js 20+
- React 18+
- TypeScript
- Vite (preferred)
- Tailwind CSS
- Charting: ECharts (preferred) or Recharts (pick one)
- Prometheus datasource: Prometheus HTTP API (`/api/v1/query`, `/api/v1/query_range`, `/api/v1/label/<label>/values`)
- Backend proxy: Node/Express (recommended) to avoid CORS and to centralize datasource config

## Non-negotiables
- Only use metrics/labels that exist in the KB extraction.
- If a requested panel/alert needs a metric not in KB, say so in the UI and propose closest alternatives.
- Provide a clean T-Mobile themed UI. No T-Mobile logo/trademark assets. Use color scheme and styling only.

## T-Mobile visual theme (must implement)
- Primary accent: Magenta `#E20074`
- Base: black/near-black + white; support dark + light mode
- Clean, modern, minimal clutter, accessible contrast
- Charts: magenta highlight + neutral grays; reserve red/orange for critical alerts

## Data model (type-safe, validated)
Create a strict schema and validate parsed KB output.

```ts
export type MetricType = "counter" | "gauge" | "histogram" | "summary" | "unknown";
export type Audience = "NOC" | "SRE" | "ENG";

export type Metric = {
  name: string;                    // exact metric name from KB
  description?: string;
  unit?: string;
  type: MetricType;
  labels: string[];                // label keys from KB
  category: string;                // latency/errors/throughput/health/resources/deps/cha-domain/etc
  audience: Audience[];
  examples?: { promql: string; note?: string }[];
  sourceRef?: { docName?: string; section?: string; page?: number };
  confidence: "high" | "medium" | "low";
};

Default drill-down dimensions (use if present in KB):

cluster, region/site, service, instance, pod

Prometheus datasource requirements

Implement a datasource adapter with:

query(promql: string): Promise<InstantVectorResult>

queryRange(promql: string, start: Date, end: Date, stepSec: number): Promise<RangeVectorResult>

labelValues(label: string): Promise<string[]>

Use a Node proxy server (Express) to:

Store Prometheus base URL in env (PROM_URL)

Avoid browser CORS issues

Optionally add auth header support later (stub cleanly; do NOT request secrets)

Prometheus HTTP API endpoints

GET /api/v1/query?query=...

GET /api/v1/query_range?query=...&start=...&end=...&step=...

GET /api/v1/label/<label>/values

KB ingestion (must implement)

Implement a robust workflow:

Upload KB doc(s) (PDF/text)

Extract text

If PDF: server-side extractor (e.g., pdf-parse) in the Node proxy

Parse extracted text into Metric[] (conservative parsing)

Present a “KB Review” UI to fix category/unit/type/labels

Persist KB as JSON (localStorage or IndexedDB)

Allow import/export of KB JSON

Parsing rules:

Only create metrics and labels explicitly present in KB.

If ambiguous, set confidence="low" and capture a sourceRef if possible.

App pages (must implement)
1) Metrics Catalog

Global search (name/description)

Filters: category, audience, type, labels contain (cluster/region/site/service/instance/pod)

Metric detail drawer: metadata + copy buttons for PromQL templates

Add to Tier 1/2/3 actions

2) Priority Builder

Tier 1 / Tier 2 / Tier 3 lists

Suggested defaults:

Tier 1 (NOC): availability/health + error spikes + saturation

Tier 2 (SRE): SLIs (availability/latency) + burn-rate candidates

Tier 3 (ENG): deep-dive breakdown metrics

Export prioritized selection JSON

3) Dashboards (three)

Each must support drill-down variables and cross-filtering:

NOC Overview

SRE SLO / Reliability

Engineering Troubleshooting

Each panel must show:

What it indicates

Metric(s) used (from KB)

PromQL template (only KB metrics/labels)

Thresholds (editable)

4) Exports

Grafana dashboard JSON skeleton:

Variables for cluster/region(site)/service/instance/pod if available

Panels with queries (placeholders okay) and units/thresholds

Prometheus alert rules YAML templates:

Prefer multi-window burn rate where SLIs exist; else threshold alerts

Download + copy-to-clipboard

Architecture (implement like this)
Monorepo (recommended)

/apps/web — React + Vite + TS + Tailwind UI

/apps/api — Node + Express proxy + KB text extraction + Prometheus proxy

/packages/shared — shared types (Metric), zod schemas, utility functions

Key modules

shared/schema/metric.ts — zod schema + types

api/routes/prometheus.ts — proxy endpoints to Prometheus

api/routes/kb.ts — upload -> extract text -> parse -> return Metric[]

web/src/lib/datasource/prometheus.ts — client wrapper to API

web/src/lib/kb/store.ts — persistence + import/export

web/src/features/catalog /* — catalog UI

web/src/features/dashboards/* — dashboards + panel definitions */

web/src/features/exports /* — grafana + alert rules generators */

web/src/theme/* — theme tokens + Tailwind config */

State management

Keep it simple:

React context + hooks (or Zustand) for:

KB metrics store

Tier selection store

Global filters (cluster/region/service/instance/pod)

Time range

Deliverables checklist

✅ Running web app + API proxy

✅ T-Mobile theme (light/dark)

✅ KB upload/extract/parse + KB review + JSON persistence

✅ Metrics catalog + filters + detail drawer

✅ Tier builder + export/import

✅ Prometheus datasource adapter working

✅ 3 dashboards with drill-down variables

✅ Exports: Grafana JSON skeleton + Prom alert rules YAML

✅ README with setup, env vars, and architecture

Execution plan (do in order)

Scaffold monorepo + shared types + Tailwind theme tokens

Implement API proxy:

Prometheus proxy routes

KB upload + PDF/text extraction

Implement KB parser + KB Review UI

Build Metrics Catalog + Priority Builder

Build dashboards + drill-down filters + real Prometheus queries

Build exports (Grafana JSON + alert rules)

Polish UX + add basic tests + finalize README

Environment variables

PROM_URL (required) — base URL of Prometheus (e.g., http://prometheus:9090
)

PORT — API server port (default 3001)

VITE_API_BASE_URL — web app API base (default http://localhost:3001
)

Start by scaffolding the monorepo, theme tokens, and the API proxy with a working /health plus Prometheus query endpoint.
