# Metrics Nexus

A performance metrics visualization platform for the **Ericsson CAF CHA (Charging Access Module)**. Metrics Nexus connects to one or more Prometheus datasources and provides a structured workflow for browsing a curated catalog of 347 CHA metrics, assigning them to audience-specific priority tiers, visualizing live data through role-targeted dashboards, and exporting ready-to-use Grafana dashboards and Prometheus alert rules.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Data Flow](#data-flow)
- [Tech Stack](#tech-stack)
- [CHA Components & Metrics Catalog](#cha-components--metrics-catalog)
- [Features](#features)
  - [Metrics Catalog](#metrics-catalog-catalog)
  - [Priority Builder](#priority-builder-priority)
  - [Dashboards](#dashboards-dashboardstab)
  - [Query Builder](#query-builder-query-builder)
  - [Target Builder](#target-builder-target-builder)
  - [Exports](#exports-exports)
  - [Admin](#admin-admin)
- [Database](#database)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
  - [Testing](#testing)
  - [Build](#build)
- [Recommendations & Future Improvements](#recommendations--future-improvements)

---

## Overview

Metrics Nexus serves three primary user groups in network operations:

| Persona | Use Case |
|---|---|
| **NOC (Network Operations Center)** | Real-time service health monitoring — error ratios, request rates, component status |
| **SRE (Site Reliability Engineering)** | SLI/SLO tracking — availability, latency percentiles, burn rate analysis |
| **Engineering** | Deep-dive troubleshooting — per-operation breakdowns, fault codes, Kafka rates, protocol-level ops |

The app operates with or without a live Prometheus instance. When no datasource is connected, dashboards show graceful "no data" states and the catalog, priority builder, and exports remain fully functional.

---

## Architecture

### Monorepo Structure

```
metrics-nexus/
├── apps/
│   ├── api/          Express backend — Prometheus proxy, datasource management, metrics discovery
│   └── web/          React + Vite frontend — dashboard, catalog, export UI
├── packages/
│   └── shared/       Zod schemas, TypeScript types, PromQL utilities, metrics catalog (347 metrics)
├── .env              Runtime environment variables
└── package.json      npm workspaces root
```

The three workspaces share a base TypeScript config and Zod-validated types, ensuring end-to-end type safety from the database schema through the API layer to the frontend components.

### Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (React + Vite :5173)                                    │
│                                                                  │
│  Catalog → Priority → Dashboards → Builder → Targets → Exports   │
│      ↓              ↓               ↓                   ↓        │
│  Zustand Stores (tiers, filters, theme) — persisted localStorage │
│      ↓              ↓               ↓                   ↓        │
│  React Query hooks (usePromQuery, usePromRangeQuery)             │
└───────────────────────────┬──────────────────────────────────────┘
                            │ /api/* (Vite proxy in dev)
┌───────────────────────────▼──────────────────────────────────────┐
│  Express API Server (:3001)                                      │
│                                                                  │
│  Routes: /health  /api/prom/*  /api/datasources/*                │
│          /api/queries/*  /api/targets/*                          │
│      ↓                                  ↓                        │
│  Global Prometheus Client     Datasource Prometheus Client       │
│  (PROM_URL env var)           (per-datasource auth: none/basic/  │
│                                TLS client cert)                  │
│      ↓                                  ↓                        │
│  Prometheus HTTP API          PostgreSQL (Drizzle ORM)           │
│  (instant + range queries)    (datasource CRUD + credentials)    │
└──────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Proxy pattern** — The API never exposes Prometheus credentials to the browser. All queries are proxied server-side, with auth headers and TLS certificates injected by the datasource client.
- **Hardcoded catalog** — All 347 CHA metrics are defined as structured TypeScript objects in `packages/shared`. This gives rich metadata (labels, PromQL examples, audience, confidence level, source doc references) without requiring a running Prometheus instance.
- **SSE streaming** — Metrics discovery from live datasources streams progress events to the browser via Server-Sent Events, avoiding timeouts on large Prometheus instances.
- **Shared Zod schemas** — Database schema, API request/response validation, and frontend form validation all derive from the same Zod definitions in `packages/shared`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18.3 + TypeScript 5.6 |
| Frontend build | Vite 6.0 |
| Routing | React Router 6.28 |
| Async state / data fetching | TanStack React Query 5.62 |
| UI state | Zustand 5.0 (tiers, filters, theme — persisted to localStorage) |
| Forms + validation | React Hook Form 7.71 + Zod |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| Charts | Apache ECharts 5.5 via echarts-for-react 3.0 |
| Icons | Lucide React |
| Backend framework | Express 4.21 |
| Runtime | Node.js 20+ |
| Database ORM | Drizzle ORM 0.45 |
| Database | PostgreSQL |
| Schema validation | Zod (shared across API + frontend) |
| Testing | Vitest 2.1 |
| TypeScript executor (dev) | tsx 4.19 with watch mode |
| Schema migrations | Drizzle Kit 0.31 |

**Theme:** T-Mobile magenta (`#E20074`) accent with full dark/light mode support, persisted to localStorage.

---

## CHA Components & Metrics Catalog

The metrics catalog covers **347 metrics** across **7 CHA subsystems**, all hardcoded with rich metadata including labels, PromQL query examples, audience classification, confidence rating, and Ericsson document references.

| Component | Metric Prefix | Count | Description |
|---|---|---|---|
| **Core** | `cha_core_*` | 122 | Online rating, balance management, policy enforcement, event processing |
| **Access** | `cha_access_*` | 97 | Protocol gateway layer — Gy, Nchf, REST interfaces |
| **Collector** | `cha_collector_*` | 85 | Usage data collection and aggregation |
| **Snapshot Producer** | `cha_snapshot_producer_*` | 23 | Periodic account snapshot generation |
| **NF Registrator** | `cha_nfreg_*` | 8 | NF registration and heartbeat |
| **BCA** | `cha_bca_*` | 8 | Balanced Charging Adjunct |
| **DLB** | `cha_dlb_*` | 4 | Dynamic Load Balancing |

### Metric Schema

Each metric carries the following metadata:

```typescript
{
  name: string;             // e.g. "cha_core_online_rate_charge_akka_requests_total"
  description: string;
  type: "counter" | "gauge" | "histogram" | "summary" | "unknown";
  unit?: string;            // "seconds", "ms", "bytes", etc.
  labels: Array<{
    key: string;
    possibleValues?: string[];
  }>;
  category: string;         // "throughput" | "errors" | "latency" | "health" | ...
  component: string;        // "core" | "access" | "collector" | ...
  audience: ("NOC" | "SRE" | "ENG")[];
  confidence: "high" | "medium" | "low";
  examples: Array<{ promql: string; note?: string }>;
  sourceRef?: { docName?: string; section?: string };
}
```

---

## Features

### Metrics Catalog (`/catalog`)

A searchable, filterable browser for all 347 CHA metrics, enriched with live data from connected Prometheus datasources.

- **Full-text search** across metric names and descriptions
- **Filter by:** component, category (throughput / errors / latency / health / ...), audience (NOC / SRE / ENG), metric type (counter / gauge / histogram / summary)
- **Metric cards** showing name, type badge, description, audience tags, **active time series count**, and **label keys** (merged from static catalog + live Prometheus data)
- **Detail drawer** — clicking a metric opens a side panel with:
  - Full metadata, PromQL query examples, and source document references
  - **Live Data summary** — time series count and label count from the active datasource
  - **Labels section** — static catalog labels (with descriptions and possible values) merged with live-discovered labels from Prometheus, each marked with a green dot if active
  - **"Build Query"** — navigates to the Query Builder with the metric name, type, and labels pre-loaded
  - **"Build Target"** — navigates to the Target Builder with the same pre-loaded data
  - **"Add to Tier"** actions for priority classification

### Priority Builder (`/priority`)

A workflow for classifying metrics into three audience-aligned tiers:

| Tier | Audience | Purpose |
|---|---|---|
| **Tier 1** | NOC | Service health — errors, saturation, availability |
| **Tier 2** | SRE | Reliability — latency SLIs, throughput, error budgets |
| **Tier 3** | ENG | Deep-dive — per-operation, fault codes, internal queues |

- **Drag metrics between tiers** (or use move actions)
- **"Suggest Defaults"** — auto-categorizes all 347 metrics by confidence level and category using built-in heuristics
- **Export tier config as JSON** — machine-readable config for use in downstream tooling
- **Import tier config from JSON** — restore a previously saved tier layout
- **Clear all tiers** — reset to empty state
- Tier state is **persisted to localStorage**, surviving page refreshes

### Dashboards (`/dashboards/:tab`)

Three live dashboards powered by Prometheus queries, rendered with Apache ECharts.

#### NOC Overview (`/dashboards/noc`)
- Overall Error Ratio — gauge with warning/critical thresholds
- Total Request Rate — timeseries
- Error Rate by Component — multi-series timeseries
- Core Health — stat panel
- Access Layer Errors — timeseries
- DLB Load Distribution — bar chart

#### SRE / SLO (`/dashboards/sre`)
- Availability SLI — current percentage vs. SLO target
- Latency percentiles (p50, p95, p99)
- Error budget burn rate
- Throughput trends

#### Engineering (`/dashboards/eng`)
- Per-operation request and error breakdown
- Fault code distribution
- Kafka producer/consumer rates
- CIL / COBA / RMCA operation counts

**All dashboards support cross-panel drill-down filtering:**

| Filter Dimension | Label |
|---|---|
| Cluster | `cluster` |
| Region | `region` |
| Service | `service` |
| Instance | `instance` |
| Pod | `pod` |

Selecting a filter value rewrites all panel PromQL queries to include the corresponding label matcher, enabling scoped incident investigation without leaving the dashboard.

**Time range and auto-refresh controls** are available in the Grafana-style top bar:

- **Time range presets:** 5m, 15m, 1h, 6h, 12h, 24h, 2d, 7d, 30d
- **Auto-refresh intervals:** Off, 5s, 10s, 30s, 1m, 5m, 15m, 30m, 1h, 2h, 1d — controls the refetch interval for all Prometheus queries globally

### Query Builder (`/query-builder`)

An intuitive PromQL expression builder with live chart preview.

- **Metric selection** — searchable dropdown populated from the connected datasource (or common metrics fallback)
- **Label matchers** — add/remove label filters with support for all four PromQL operators (`=`, `!=`, `=~`, `!~`). The label key dropdown is augmented with the selected metric's actual labels from Prometheus
- **Function chaining** — inner functions (rate, irate, increase, delta) + outer aggregations (sum, avg, min, max, histogram_quantile) with group-by and quantile inputs
- **Math expressions** — append arbitrary math (e.g. `/ 60`, `* 100`)
- **Multi-target panels** — define multiple independent PromQL targets on a single chart, each with its own expression and legend format (Grafana-style `{{label}}` interpolation)
- **Panel settings** — Y-axis unit (TPS, seconds, ms, bytes, percent, ...), decimal precision, stacking toggle, X-axis time format (auto-adaptive or explicit: HH:mm, HH:mm:ss, MM/dd HH:mm, yyyy-MM-dd)
- **Live PromQL preview** with copy-to-clipboard
- **Run Query** — renders an inline chart preview without leaving the page
- **Save/Update** — persists queries to PostgreSQL with full CRUD
- **Saved queries sidebar** — searchable list with favorites, edit, and delete actions
- **Catalog integration** — "Build Query" button in the catalog pre-fills the metric and labels

### Target Builder (`/target-builder`)

A dedicated builder for individual Prometheus query targets — the building blocks for dashboard panels. Mirrors the Query Builder form layout but focused on single-target definitions.

- **Same PromQL builder** — metric selection, label matchers, function chaining, math expressions
- **Legend format** — Grafana-style legend template (e.g. `"NCHF Charging"` or `"{{instanceName}} | {{code}}"`)
- **Ref ID** — target ordering identifier (A, B, C) for multi-target panel composition
- **Full CRUD** — targets persisted to PostgreSQL via `/api/targets` REST endpoints
- **Saved targets sidebar** — searchable list with favorites, edit, and delete
- **Live preview chart** — run the target expression and see results inline
- **Catalog integration** — "Build Target" button in the catalog pre-fills the metric and labels

### Exports (`/exports`)

Generates ready-to-use infrastructure artifacts from the current tier configuration:

**Grafana Dashboard JSON**
- Importable `.json` file structured for Grafana
- Includes template variables for cluster, region, service, instance, pod
- Panels auto-generated from Tier 1/2/3 metrics using appropriate chart types
- Copy-to-clipboard or download

**Prometheus Alert Rules YAML**
- Tier 1 metrics → burn-rate alerts (multi-window, multi-burn-rate pattern)
- Tier 2 metrics → static threshold alerts
- Standard `groups` / `rules` structure, importable via Prometheus rule files or Alertmanager
- Copy-to-clipboard or download

Both generators use the PromQL template utilities from `packages/shared` for consistent query construction.

### Admin (`/admin`)

#### Datasources Tab
Manage multiple Prometheus datasources, each stored in PostgreSQL:

- **List all datasources** with status indicators
- **Add datasource** — form-validated with Zod:
  - Name, URL
  - Auth type: `none` | `basic` (username/password) | `tls` (client cert + key + optional CA)
  - Skip TLS verification toggle
- **Test connection** — fires a live request to the datasource and reports success + metric count
- **Edit / Delete** existing datasources
- **View metrics** — fetch and display the metric list from a live datasource (basic or extended with sample counts)
- **Export metrics** — stream metric discovery via Server-Sent Events with real-time progress dialog (progress bar + activity log)

#### Settings Tab
Global application configuration.

---

## Database

PostgreSQL is used to persist datasource configurations, saved queries, and saved targets.

### Schema: `datasources`

| Column | Type | Description |
|---|---|---|
| `id` | serial (PK) | Auto-increment ID |
| `name` | text | Human-readable label |
| `url` | text | Prometheus base URL |
| `type` | text | Datasource type (default: `prometheus`) |
| `auth_type` | text | `none` \| `basic` \| `tls` |
| `tls_client_cert` | text | PEM-encoded TLS client certificate |
| `tls_client_key` | text | PEM-encoded TLS client private key |
| `ca_cert` | text | PEM-encoded CA certificate |
| `skip_verify` | boolean | Disable TLS certificate verification |
| `status` | text | `active` \| `inactive` |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last modification timestamp |

### Schema: `metric_queries`

| Column | Type | Description |
|---|---|---|
| `id` | varchar (PK) | UUID, auto-generated |
| `name` | text | Human-readable query name |
| `description` | text | Optional description |
| `expression` | text | Built PromQL expression |
| `metric_name` | text | Base metric name |
| `metric_type` | text | counter / gauge / histogram / summary |
| `labels` | jsonb | Label matchers `Record<string, string>` |
| `aggregation` | text | Aggregation combo (e.g. `sum(increase)`) |
| `range` | text | Range vector (e.g. `1m`, `5m`) |
| `visualization_type` | text | Chart type (line, area, bar, scatter, pie, donut, sparkline) |
| `color` | text | Series color hex |
| `is_favorite` | boolean | Favorited flag |
| `datasource_id` | integer | Associated datasource |
| `targets` | jsonb | Multi-target array `[{ expr, legendFormat }]` |
| `unit` | text | Y-axis unit (TPS, s, ms, bytes, percent, ...) |
| `stack` | boolean | Stacking enabled |
| `decimals` | integer | Y-axis decimal precision |
| `x_axis_format` | text | X-axis time format (auto, HH:mm, HH:mm:ss, ...) |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last modification timestamp |

### Schema: `metric_targets`

| Column | Type | Description |
|---|---|---|
| `id` | varchar (PK) | UUID, auto-generated |
| `name` | text | Human-readable target name |
| `description` | text | Optional description |
| `expression` | text | Built PromQL expression |
| `metric_name` | text | Base metric name |
| `metric_type` | text | counter / gauge / histogram / summary |
| `labels` | jsonb | Label matchers `Record<string, string>` |
| `aggregation` | text | Aggregation combo |
| `range` | text | Range vector |
| `legend_format` | text | Grafana-style legend template |
| `ref_id` | text | Target ordering identifier (A, B, C) |
| `color` | text | Series color hex |
| `is_favorite` | boolean | Favorited flag |
| `datasource_id` | integer | Associated datasource |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last modification timestamp |

### Database Commands

```bash
npm run db:push       # Push schema changes directly (dev)
npm run db:generate   # Generate migration files
npm run db:migrate    # Run pending migrations
```

---

## API Reference

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok", timestamp }` |

### Global Prometheus Proxy

Proxies to the Prometheus instance configured via `PROM_URL`.

| Method | Path | Query Params | Description |
|---|---|---|---|
| `GET` | `/api/prom/query` | `query`, `time` | Instant query |
| `GET` | `/api/prom/query_range` | `query`, `start`, `end`, `step` | Range query |
| `GET` | `/api/prom/label/:label/values` | — | Label value enumeration |

### Datasource Management

| Method | Path | Body / Params | Description |
|---|---|---|---|
| `GET` | `/api/datasources` | — | List all datasources |
| `GET` | `/api/datasources/:id` | — | Get single datasource |
| `POST` | `/api/datasources` | JSON body (Zod-validated) | Create datasource |
| `PATCH` | `/api/datasources/:id` | JSON body (partial) | Update datasource |
| `DELETE` | `/api/datasources/:id` | — | Delete datasource |
| `POST` | `/api/datasources/:id/test` | — | Test connection → `{ success, metricCount }` |
| `GET` | `/api/datasources/:id/metrics` | `?extended=true` | Fetch metric list from datasource |
| `GET` | `/api/datasources/:id/metrics/export` | `?format=json\|csv` | Download metrics export file |
| `GET` | `/api/datasources/:id/metrics/export/stream` | — | SSE stream with progress events |

### Saved Queries (Query Builder)

| Method | Path | Body / Params | Description |
|---|---|---|---|
| `GET` | `/api/queries` | — | List all saved queries |
| `GET` | `/api/queries/:id` | — | Get single query |
| `POST` | `/api/queries` | JSON body (Zod-validated) | Create query |
| `PATCH` | `/api/queries/:id` | JSON body (partial) | Update query |
| `DELETE` | `/api/queries/:id` | — | Delete query |

### Saved Targets (Target Builder)

| Method | Path | Body / Params | Description |
|---|---|---|---|
| `GET` | `/api/targets` | — | List all saved targets |
| `GET` | `/api/targets/:id` | — | Get single target |
| `POST` | `/api/targets` | JSON body (Zod-validated) | Create target |
| `PATCH` | `/api/targets/:id` | JSON body (partial) | Update target |
| `DELETE` | `/api/targets/:id` | — | Delete target |

### Per-Datasource Prometheus Proxy

Proxies to a specific stored datasource, injecting its auth credentials server-side.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/datasources/:id/prom/query` | Instant query via datasource |
| `GET` | `/api/datasources/:id/prom/query_range` | Range query via datasource |
| `GET` | `/api/datasources/:id/prom/label/:label/values` | Label values via datasource |

**SSE Stream Events** (`/metrics/export/stream`):

| Event | Payload |
|---|---|
| `connected` | `{ message }` |
| `progress` | `{ current, total, percentage }` |
| `activity` | `{ message }` |
| `complete` | `{ metrics: ExtendedMetricInfo[] }` |
| `error` | `{ message }` |

---

## Project Structure

```
apps/
  api/
    src/
      index.ts                              Express app entry, middleware, error handling
      env.ts                               Environment variable loading
      db/
        index.ts                           PostgreSQL pool + Drizzle instance
        storage.ts                         DatasourceStorage CRUD abstraction
        metric-query-storage.ts           MetricQuery CRUD (Query Builder)
        metric-target-storage.ts          MetricTarget CRUD (Target Builder)
      routes/
        health.ts                          GET /health
        prometheus.ts                      Global Prometheus proxy routes
        datasources.ts                     Datasource CRUD + metrics export + SSE
        datasource-proxy.ts               Per-datasource Prometheus proxy routes
        metric-queries.ts                 Saved query CRUD routes (/api/queries)
        metric-targets.ts                 Saved target CRUD routes (/api/targets)
      services/
        prometheus-client.ts              HTTP client for global PROM_URL
        datasource-prometheus-client.ts   Per-datasource client (none/basic/TLS auth)
    drizzle.config.ts                      Drizzle Kit config (schema path, DB URL)

  web/
    src/
      main.tsx                             React entry — router, QueryClient, toasts
      components/
        AppShell.tsx                       Layout shell (sidebar nav, top bar, theme toggle)
        TimeRangePicker.tsx               Global time range selector
        charts/EChartWrapper.tsx          ECharts wrapper with theme tokens
        ui/                              Shared UI primitives (Button, Card, Dialog,
                                         Drawer, Input, Select, Table, Tabs, Toast, ...)
      features/
        catalog/
          CatalogPage.tsx                Search + filter metrics, detail drawer, live data enrichment
          MetricCard.tsx                 Metric card with labels + active series count
          MetricDetail.tsx               Detail drawer — Build Query/Target, live labels, tier actions
        priority-builder/
          PriorityBuilderPage.tsx        Tier 1/2/3 assignment, suggest defaults, export/import
        dashboards/
          DashboardPage.tsx              Dashboard container + drill-down filter bar
          shared/
            DashboardPanel.tsx           Panel render (loading, error, no-data, chart states)
            DrillDownBar.tsx             Cross-panel filter controls
          noc/panels.ts                  NOC dashboard panel definitions
          sre/panels.ts                  SRE dashboard panel definitions
          eng/panels.ts                  Engineering dashboard panel definitions
          traffic/panels.ts             Traffic dashboard (converted from Grafana JSON)
        query-builder/
          QueryBuilderPage.tsx          Query builder page with form + chart preview + sidebar
          QueryBuilderForm.tsx          PromQL builder form (multi-target, panel settings)
          QueryChart.tsx                Chart renderer (single + multi-target, stacking, units)
          SavedQueriesPanel.tsx         Sidebar: saved queries with CRUD
          MetricSearchDropdown.tsx      Shared metric search dropdown (reused by Target Builder)
          promql-builder.ts            PromQL expression builder + function/operator constants
        target-builder/
          TargetBuilderPage.tsx         Target builder page with form + chart preview + sidebar
          TargetBuilderForm.tsx         Target definition form (metric, labels, legend, refId)
          SavedTargetsPanel.tsx         Sidebar: saved targets with CRUD
        exports/
          ExportsPage.tsx               Download/copy Grafana JSON + Alert Rules YAML
          generators/
            grafana-json.ts             Grafana dashboard JSON generator
            alert-rules-yaml.ts         Prometheus alert rules YAML generator
        admin/
          AdminPage.tsx                 Admin tabs (Datasources, Settings)
          DatasourceForm.tsx            Add/edit datasource form (Zod-validated)
          DatasourceTable.tsx           Datasource list with actions
          ExportProgressDialog.tsx      SSE-driven export progress dialog
      lib/
        hooks/
          use-prom-query.ts             React Query hooks (instant, range, multi-target) with
                                        configurable auto-refresh from settings store
        stores/
          theme-store.ts               Dark/light mode (localStorage)
          filter-store.ts              Global label filters + time range (9 presets)
          tier-store.ts                Tier 1/2/3 metric assignments (localStorage)
          settings-store.ts            App-wide settings (refresh interval, datasource)
          panel-sequencer-store.ts     Sequential panel loading for dashboards
          query-log-store.ts           Prometheus query activity log
        api/
          datasources.ts               Typed API client for datasource endpoints
          metric-queries.ts            Typed API client for saved queries
          metric-targets.ts            Typed API client for saved targets
      theme/tokens.ts                   Color tokens, chart series colors, magenta accent palette

packages/
  shared/
    src/
      schemas/
        metric.ts                       Zod schema — Metric, MetricType, Audience, Confidence
        datasource.ts                   Drizzle table + Zod validation for Datasource
        metric-query.ts                 Drizzle table + Zod for MetricQuery (Query Builder)
        metric-target.ts                Drizzle table + Zod for MetricTarget (Target Builder)
        prometheus.ts                   Prometheus API response schemas
        tier.ts                         TierConfig schema (tier1/tier2/tier3 string arrays)
        filters.ts                      GlobalFilter + TimeRange + REFRESH_INTERVALS
        metrics-discovery.ts            ExtendedMetricInfo, MetricsProgress, ExportFormat
      utils/
        promql-templates.ts             PromQL builder functions (rate, errorRatio, burnRate, ...)
        metric-categories.ts            CATEGORIES and COMPONENTS enumerations
      data/
        metrics-catalog.ts              Aggregates all 347 metrics + search indexes
        core-metrics.ts                 122 Core component metrics
        access-metrics.ts               97 Access component metrics
        collector-metrics.ts            85 Collector component metrics
        snapshot-producer-metrics.ts    23 Snapshot Producer metrics
        nfreg-metrics.ts                8 NF Registrator metrics
        bca-metrics.ts                  8 BCA metrics
        dlb-metrics.ts                  4 DLB metrics
        components.ts                   Component metadata (id, name, prefix, docRef)
      __tests__/                        Catalog integrity + PromQL template unit tests
      index.ts                          Public barrel export
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **PostgreSQL** (for datasource persistence — app still partially works without it)
- A **Prometheus** instance (optional — dashboards show graceful "no data" states without one)

### Setup

```bash
# Install all workspace dependencies
npm install

# Copy example environment config
cp .env.example .env
```

Edit `.env` with your environment details.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | *(required)* | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/dbname` |
| `PGHOST` | `localhost` | PostgreSQL host |
| `PGPORT` | `5432` | PostgreSQL port |
| `PGUSER` | *(required)* | PostgreSQL username |
| `PGPASSWORD` | *(required)* | PostgreSQL password |
| `PGDATABASE` | *(required)* | PostgreSQL database name |
| `PROM_URL` | `http://localhost:9090` | Global Prometheus base URL |
| `PORT` | `3001` | API server port |
| `VITE_API_BASE_URL` | `http://localhost:3001` | Frontend API base URL |

After configuring `.env`, push the database schema:

```bash
npm run db:push
```

### Development

```bash
# Start both API (:3001) and web (:5173) concurrently
npm run dev

# Or start individually
npm run dev:api   # Express API on :3001
npm run dev:web   # Vite dev server on :5173 (proxies /api/* to :3001)
```

### Testing

```bash
npm test
```

Tests cover catalog data integrity (no duplicate names, required fields) and PromQL template builder output.

### Build

```bash
npm run build
```

Builds in dependency order: `packages/shared` → `apps/api` → `apps/web`. Output:
- `apps/api/dist/` — compiled Express server
- `apps/web/dist/` — static frontend assets

---

## Recommendations & Future Improvements

### High Priority

**1. Dynamic metric discovery**
The current catalog is fully hardcoded. Adding a discovery pipeline that periodically fetches live metric metadata from Prometheus (`/api/v1/metadata`) and merges it with the curated catalog would allow the app to surface new metrics as the CHA software evolves without manual updates to the catalog files.

**2. Alert rule evaluation & preview**
The export page generates alert YAML but has no way to preview which alerts would currently fire. Adding a "dry-run" mode that evaluates generated alert rules against a live datasource and shows current firing status would significantly improve confidence before deploying alert configs.

**3. Authentication & multi-tenancy**
There is no user authentication. Adding OAuth2/OIDC (e.g. Keycloak) would allow role-based access control — NOC users see only their dashboards, SREs can manage tier configs, admins manage datasources.

**4. Datasource credentials security**
TLS client keys and passwords are stored as plaintext in PostgreSQL. Encrypting secrets at rest (e.g. using a KMS-derived key or HashiCorp Vault integration) is essential before production use.

**5. Dashboard persistence**
Dashboard panel layouts, visible panels, and drill-down filter presets are not saved. Adding user-specific or shared saved views (stored in the database) would let teams create bookmarked investigations.

### Medium Priority

**6. Alertmanager integration**
Beyond exporting alert YAML, the admin panel could push alert rules directly to a connected Alertmanager instance via its REST API, eliminating the manual copy-paste step.

**7. Annotation support**
Overlaying deployment events, incidents, or maintenance windows on timeseries charts (sourced from a separate events API or Grafana annotation API) would provide crucial context for anomalies.

**8. Variable-based panel templates**
Currently panels have a single PromQL string. Supporting multiple query variants per panel (e.g. different `by()` groupings selectable in the UI) would make dashboards more flexible without requiring new panel definitions.

**9. CSV export of tier configuration**
The priority builder exports JSON only. A CSV export mapping metric names to their tiers would simplify reporting and integration with external documentation systems.

**10. Metric usage analytics**
Tracking which metrics are most-queried across datasources (stored in PostgreSQL) could surface high-value candidates for Tier 1 promotion and identify unused metrics in the catalog.

**11. Responsive / mobile layout**
The current layout is optimized for wide screens. Adding responsive breakpoints for tablet and mobile would broaden accessibility for on-call engineers.

### Lower Priority

**12. PromQL editor with autocomplete**
An embedded PromQL editor (e.g. Monaco or CodeMirror with a Prometheus language server) in the catalog detail drawer and dashboard panel editor would let advanced users customize queries without leaving the app.

**13. Panel editing UI**
Dashboard panels are currently defined in code. A drag-and-drop panel editor (add, remove, resize, reorder panels; change chart types) would allow dashboards to be customized without a code deployment.

**14. Grafana datasource sync**
A one-click sync that registers configured Prometheus datasources into a connected Grafana instance (via Grafana HTTP API) would streamline the "configure once, use everywhere" workflow.

**15. Historical tier config versioning**
Store snapshots of tier configurations in the database with timestamps and author info, enabling rollback and audit history.

**16. OpenTelemetry / self-instrumentation**
Adding OTEL tracing and metrics to the API server itself (request latency, Prometheus proxy error rates, datasource health) would provide operational visibility into the tool itself.

**17. Docker Compose setup**
A `docker-compose.yml` bundling the API, web (nginx), and PostgreSQL would dramatically simplify onboarding and CI/CD deployment. A production-ready Dockerfile for each app is also missing.
