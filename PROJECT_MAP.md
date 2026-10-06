# Project Map

Generated on 2026-05-28.

## Overview

This repository is a Vite + React + TypeScript logistics dashboard for a "Tata Steel Logistics Control Tower" experience. It uses React Router for page routing, Zustand for UI/filter state, Tailwind CSS plus CSS custom properties for styling, ECharts for charts, Leaflet/React Leaflet for map views, and mock services/constants as the current data layer.

## File-To-Section Mapping

| File / Folder | Section / Responsibility |
| --- | --- |
| `index.html` | Vite HTML entry point and root DOM node. |
| `src/main.tsx` | React bootstrap. Imports global styles and mounts `<App />`. |
| `src/App.tsx` | Top-level router. Defines all active app routes and redirects. |
| `src/styles/globals.css` | Main design system: tokens, base styles, component classes, utilities, Leaflet/ECharts overrides, responsive rules. |
| `src/index.css` | Legacy/unused stylesheet note, with stray utility content. Main app imports `globals.css`, not this file. |
| `src/App.css` | Empty placeholder; styles are centralized in `src/styles/globals.css`. |
| `tailwind.config.js` | Tailwind theme extensions: token-backed colors, fonts, KPI font sizes, shadows, animations, keyframes, custom breakpoints. |
| `src/pages/Dashboard/Dashboard.tsx` | Root landing/dashboard selector page for Rail vs Road operations. Contains hero-like module cards and footer. |
| `src/pages/Road/**` | Road dashboards: outbound, intra-plant, transit, safety, efficiency, reports. |
| `src/pages/Rail/**` | Rail dashboards: outbound, transit, intra-plant, safety, reports. Only outbound and transit are actively routed. |
| `src/pages/Transit/TransitDashboard.tsx` | Shared/older transit dashboard page, currently not wired in `App.tsx`. |
| `src/pages/IntraPlant/IntraPlantDashboard.tsx` | Shared/older intra-plant dashboard page, currently not wired in `App.tsx`. |
| `src/components/common/**` | Shared UI primitives: nav shell, filters, alerts, KPI cards, chart wrappers, table, status badge, error boundary. |
| `src/components/road/RoadPageHeader.tsx` | Shared road section header with tabs and dashboard exit action. |
| `src/pages/Road/RoadOutbound/RoadMap.tsx` | Road outbound Leaflet map. |
| `src/pages/Rail/RailOutbound/RailMap.tsx` | Rail outbound Leaflet map. |
| `src/pages/Rail/RailOutbound/components/**` | Rail outbound drill-down KPI card system. |
| `src/hooks/useFilters.ts` | Convenience hook around persisted filter store with debounced text updates. |
| `src/hooks/useRoadData.ts` | Road data-fetching hooks and loading/error state wrappers. |
| `src/hooks/useRailData.ts` | Rail data-fetching hooks and loading/error state wrappers. |
| `src/store/uiStore.ts` | Zustand UI state: sidebar, alerts, current transport section, intra-plant tab, loading. |
| `src/store/filterStore.ts` | Zustand persisted filter state for rail, road, and reports. |
| `src/services/api.ts` | Axios client configuration with auth token and response interceptors. |
| `src/services/roadService.ts` | Road service facade. Currently returns filtered mock data with simulated latency. |
| `src/services/railService.ts` | Rail service facade. Currently returns filtered mock data with simulated latency. |
| `src/constants/mockData.ts` | Primary mock data for KPIs, lists, filters, services, alerts. |
| `src/constants/uiMockData.ts` | Mock data for the highly visual transit/intra-plant UI pages. |
| `src/types/**` | Shared TypeScript interfaces for common, road, rail, and re-exported app types. |
| `public/favicon.svg`, `public/icons.svg` | Public static SVG assets. |
| `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` | Local image/SVG assets. `hero.png` is present but not currently used by routed pages. |
| `dist/` | Built output. |
| `LCT_UI.pdf` | Design/reference PDF, not imported by application code. |

## Component Hierarchy

### App Root

```text
main.tsx
+-- App
    +-- BrowserRouter
    +-- ErrorBoundary
    +-- Routes
        +-- Dashboard
        +-- RoadOutbound
        +-- RoadIntraPlant
        +-- RoadTransit
        +-- RoadSafety
        +-- RoadEfficiency
        +-- RailOutbound
        +-- RailTransit
```

### Dashboard / Landing Page

```text
Dashboard
+-- Header
|   +-- Tata Steel brand block
|   +-- live clock
|   +-- system status pill
+-- Main
|   +-- Rail navigation card
|   |   +-- icon
|   |   +-- description
|   |   +-- quick stats
|   |   +-- click handler -> /rail/outbound
|   +-- Road navigation card
|       +-- icon
|       +-- description
|       +-- quick stats
|       +-- click handler -> /road/outbound
+-- service status strip
+-- footer
```

### Shared Page Shell Path

`PageShell` is available as a reusable layout:

```text
PageShell
+-- TopNavBar
+-- optional sticky FilterBar region
+-- main content slot
+-- AlertBanner
```

Most active road/rail pages currently use custom full-screen wrappers instead of `PageShell`.

### Road Outbound

```text
RoadOutbound
+-- RoadPageHeader(activeTab="outbound")
+-- FilterBar(type="road")
+-- RoadMap
+-- DataTable
+-- KPICardBucketed
+-- DonutChart
+-- ReactECharts bar chart
```

### Rail Outbound

```text
RailOutbound
+-- inline rail header and tabs
+-- FilterBar(type="rail")
+-- RailMap
+-- DataTable
+-- DrillDownContainer
|   +-- DrillDownCard
+-- DonutChart
+-- ReactECharts bar chart
```

### Road Section Pages

```text
RoadIntraPlant / RoadTransit / RoadSafety / RoadEfficiency
+-- RoadPageHeader
+-- page-local micro-components
+-- page-local mock/UI data
+-- ECharts, KPI panels, tables, modals, and custom visual map panels as needed
```

### Rail Transit

```text
RailTransit
+-- inline rail header and tabs
+-- page-local MetricCard and DetentionStat micro-components
+-- ECharts delay/GPS/detention panels
+-- custom SVG/CSS rail network panel
```

## Routing Structure

Routes are defined in `src/App.tsx`.

| Path | Component | Status |
| --- | --- | --- |
| `/` | Redirects to `/dashboard` | Active |
| `/dashboard` | `Dashboard` | Active landing page |
| `/road/outbound` | `RoadOutbound` | Active |
| `/road/intra-plant` | `RoadIntraPlant` | Active |
| `/road/transit` | `RoadTransit` | Active |
| `/road/safety` | `RoadSafety` | Active |
| `/road/efficiency` | `RoadEfficiency` | Active |
| `/rail/outbound` | `RailOutbound` | Active |
| `/rail/transit` | `RailTransit` | Active |
| `*` | Redirects to `/dashboard` | Active fallback |

Defined but not actively routed:

- `RoadReports`
- `RailIntraPlant`
- `RailSafety`
- `RailReports`
- `TransitDashboard`
- `IntraPlantDashboard`

Navigation is split across multiple implementations:

- `Dashboard` uses `useNavigate()` to enter `/rail/outbound` or `/road/outbound`.
- `RoadPageHeader` owns road tabs for `/road/outbound`, `/road/intra-plant`, `/road/transit`, `/road/safety`, `/road/efficiency`.
- `RailOutbound` and `RailTransit` each define their own inline rail tab header.
- `TopNavBar` exists for `PageShell`, but its `NAV_ITEMS` point to `/intra-plant`, `/transit`, and `/reports`, which are not active routes in `App.tsx`.

## Reusable UI Inventory

| Component / Class | Location | Purpose |
| --- | --- | --- |
| `ErrorBoundary` | `src/components/common/ErrorBoundary.tsx` | Catches render errors around the routed app. |
| `TopNavBar` | `src/components/common/TopNavBar.tsx` | Sticky global nav/status/alert bar for `PageShell`. |
| `PageShell` | `src/components/common/PageShell.tsx` | Shared layout wrapper with navbar, optional filter bar, content, and alerts. |
| `AlertBanner` | `src/components/common/AlertBanner.tsx` | Bottom alert banner driven by UI store alerts. |
| `FilterBar` | `src/components/common/FilterBar.tsx` | Rail/road filter controls backed by Zustand filters. |
| `KPICard` | `src/components/common/KPICard.tsx` | Generic KPI card with trend and loading states. |
| `KPICardBucketed` | `src/components/common/KPICardBucketed.tsx` | KPI card for grouped/bucketed metrics. |
| `DataTable` | `src/components/common/DataTable.tsx` | Generic sortable/paginated table with loading and empty states. |
| `DonutChart` | `src/components/common/DonutChart.tsx` | ECharts donut chart wrapper with center value. |
| `StatusBadge` | `src/components/common/StatusBadge.tsx` | Status label styling for table/list values. |
| `RoadPageHeader` | `src/components/road/RoadPageHeader.tsx` | Reusable road dashboard header, tab bar, and exit button. |
| `DrillDownContainer` | `src/pages/Rail/RailOutbound/components/DrillDownContainer.tsx` | Rail outbound KPI drill-down grouping. |
| `DrillDownCard` | `src/pages/Rail/RailOutbound/components/DrillDownCard.tsx` | Expandable KPI drill-down card. |
| `.card`, `.card-elevated` | `src/styles/globals.css` | Shared card surfaces. |
| `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` | `src/styles/globals.css` | Shared button styles. |
| `.input`, `.select` | `src/styles/globals.css` | Shared form controls. |
| `.badge-*` | `src/styles/globals.css` | Shared status badge styles. |
| `.skeleton` | `src/styles/globals.css` | Shared shimmer loading surface. |
| `.sci-fi-panel` | `src/index.css` | HUD-style panel utility used by several visual dashboard pages. This class is not in the imported stylesheet path unless `index.css` is imported elsewhere. |

## Styling Architecture

- Styling is primarily Tailwind utility classes inside TSX components.
- Design tokens live as CSS custom properties in `src/styles/globals.css` under `:root`.
- Tailwind maps many token values in `tailwind.config.js`, allowing both `text-[var(--...)]` and named utilities like `text-accent-blue`.
- Reusable semantic classes are declared in `@layer components`:
  - cards
  - KPI text
  - badges
  - buttons
  - inputs/selects
  - table styles
  - nav tabs
  - tooltip
  - alert banner
- Utility classes in `@layer utilities` include `text-gradient`, `glass`, `glow-blue`, `border-gradient`, and `tabular-nums`.
- Vendor-specific overrides are centralized for Leaflet and ECharts.
- Some pages contain extensive local inline styling and page-local micro-components, especially the transit/safety/intra-plant dashboards.
- `src/index.css` and `src/App.css` appear to be legacy or unused. `src/main.tsx` imports `src/styles/globals.css`.

## Animation System

Animations come from three places:

1. Tailwind custom animations in `tailwind.config.js`
   - `animate-fade-in`
   - `animate-slide-up`
   - `animate-slide-down`
   - `animate-pulse-slow`
   - `animate-shimmer`
   - `animate-ticker`

2. Tailwind built-ins
   - `animate-pulse`
   - `animate-ping`
   - transition utilities such as `transition-all`, `duration-200`, `duration-500`, `hover:scale-*`, `group-hover:*`

3. Chart/map rendering
   - ECharts handles chart rendering and tooltip animation.
   - Leaflet handles map tiles and marker rendering.
   - Several transit views use CSS/SVG visual effects for glowing route lines, pings, and HUD panels.

Loading states use skeleton blocks and shimmer/pulse classes. Navigation and dashboard cards rely heavily on hover transitions and delayed mount transitions.

## State Management Overview

### Zustand Stores

`src/store/uiStore.ts`

- `sidebarOpen`
- `activeAlerts`
- `dismissedAlerts`
- `currentSection`
- `intraPlantTab`
- `isLoading`
- actions for toggling sidebar, managing alerts, changing active section/tab, and loading state

`src/store/filterStore.ts`

- `railFilters`
- `roadFilters`
- `reportFilters`
- setters and resetters for each filter group
- persisted to `sessionStorage` using Zustand `persist` and key `lct-filter-store`

### Hooks

`src/hooks/useFilters.ts`

- Wraps `filterStore`.
- Adds debounced setters for text search fields.
- Used by `FilterBar` and data hooks.

`src/hooks/useRoadData.ts`

- Fetches road outbound KPIs and vehicle lists whenever road filters change.
- Exposes loading/error/refetch state.
- Provides additional safety/fleet hooks through a generic fetch hook factory.

`src/hooks/useRailData.ts`

- Fetches rail outbound KPIs and rake lists whenever rail filters change.
- Exposes loading/error/refetch state.
- Provides additional intra-plant/operator/delay/speed hooks through a generic fetch hook factory.

### Data Layer

- `roadService` and `railService` currently return mock data from `src/constants/mockData.ts` after simulated latency.
- `src/services/api.ts` defines an Axios client for real API integration, but the service files currently comment out those calls.
- Some highly visual pages use direct mock constants from `src/constants/uiMockData.ts` rather than the service layer.

## Files Controlling Key Sections

### Navbar

- Main reusable navbar: `src/components/common/TopNavBar.tsx`
- Road page navbar/tabs: `src/components/road/RoadPageHeader.tsx`
- Rail outbound navbar/tabs: `src/pages/Rail/RailOutbound/RailOutbound.tsx`
- Rail transit navbar/tabs: `src/pages/Rail/RailTransit/RailTransit.tsx`
- Router destinations: `src/App.tsx`

Note: `TopNavBar` is only used by `PageShell`, and most active pages currently define or use their own page-specific headers.

### Hero Section

- Dashboard hero/landing selector: `src/pages/Dashboard/Dashboard.tsx`

There is no separate `Hero` component. The dashboard's first-screen experience is implemented inline with the branded header, Rail/Road module cards, ambient background effects, and service status strip.

### Footer

- Dashboard footer: `src/pages/Dashboard/Dashboard.tsx`

There is no shared `Footer` component. Most routed dashboard pages do not render a footer.

### Pricing Section

- No pricing section exists in the repository.
- No routed page or component currently implements pricing UI.

### Landing Page

- Landing route: `/dashboard`
- Landing component: `src/pages/Dashboard/Dashboard.tsx`
- Root redirect to landing page: `src/App.tsx`
