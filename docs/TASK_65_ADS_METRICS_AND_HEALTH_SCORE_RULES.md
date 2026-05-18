# TASK-65 Ads Metrics And Health Score Rules

## Purpose

This document defines draft v1 metrics and health score rules for the SALMAN OS Ads module.

This task is planning only.

- No metrics code
- No Google Sheets connection
- No credentials
- No Supabase/RLS/RPC changes
- No SQL execution
- No real audit or report generation

## v1 Core Metrics

The Ads module should normalize these core metrics before rendering dashboard, audit, action, and report views.

| Metric | Meaning |
| --- | --- |
| `spend` | 광고비 |
| `impressions` | 노출 수 |
| `clicks` | 클릭 수 |
| `ctr` | 클릭률 |
| `cpc` | 클릭당 비용 |
| `conversions` | 전환 수 |
| `cpa` | 전환당 비용 |
| `revenue` | 광고 기여 매출 또는 전환 가치 |
| `roas` | 광고비 대비 매출 비율 |

## Safe Calculation Formulas

All formulas must be safe against missing, blank, non-numeric, and zero denominator values.

```text
ctr = clicks / impressions * 100
cpc = spend / clicks
cpa = spend / conversions
roas = revenue / spend * 100
```

Rules:

- Use normalized numeric values only.
- Return `null` when a required numerator is missing.
- Return `null` when a denominator is missing or zero.
- Do not display `Infinity`, `NaN`, or misleading `0` for unavailable ratios.
- Keep raw values and calculated values separate in the normalizer output.

## Missing And Zero Data Handling

### Missing data

Use `null` when data is not available, not parseable, or blocked by connector diagnostics.

Examples:

- missing sheet id
- missing tab
- empty tab
- permission denied
- required column missing

### Zero values

Zero is valid only when the source explicitly reports `0`.

Examples:

- `clicks = 0` is valid.
- `conversions = 0` is valid.
- `spend = 0` is valid.

Ratio handling:

- `ctr` is `null` when `impressions = 0`.
- `cpc` is `null` when `clicks = 0`.
- `cpa` is `null` when `conversions = 0`.
- `roas` is `null` when `spend = 0`.

UI should distinguish:

- `0`: real zero
- `-`: unavailable or not calculable
- `데이터 미수집`: connector/source issue

## Health Score Draft

`healthScore` should be a 0-100 review score for internal staff prioritization.

Draft scoring model:

| Component | Max points | Meaning |
| --- | ---: | --- |
| Data freshness and completeness | 25 | required sheet/tab/column availability and recent update |
| Spend stability | 15 | no unexplained cost spike |
| Conversion stability | 20 | no sharp conversion drop |
| CPC control | 15 | CPC not materially worse than comparison baseline |
| ROAS efficiency | 15 | ROAS not materially below comparison baseline |
| High-cost no-conversion exposure | 10 | no high-spend segment with zero conversions |

Total: 100 points.

Initial rule:

- Start from 100.
- Subtract component penalties.
- Clamp final score to `0..100`.
- Return `null` if source data is missing enough that scoring would be misleading.

## Draft Penalty Guidance

These thresholds are placeholders and require real data review before production use.

| Signal | Draft penalty |
| --- | ---: |
| Missing sheet id or permission denied | score `null`, status `missing_data` |
| Required tab missing | -15 to -25 |
| Column mismatch blocking metric calculation | -20 to -35 |
| Source data stale beyond approved freshness threshold | -10 to -20 |
| Spend increased sharply vs baseline | -10 to -15 |
| Conversions dropped sharply vs baseline | -10 to -20 |
| CPC increased sharply vs baseline | -8 to -15 |
| ROAS dropped sharply vs baseline | -10 to -20 |
| High spend with zero conversions | -10 to -20 |

Baseline comparison should be defined in a later task.

Possible baselines:

- previous 7 days
- previous 14 days
- previous 4 weeks
- same weekday average
- client-specific target table

## Status Mapping

```text
missing_data:
  healthScore is null due to missing config/data/permission/critical columns

risk:
  healthScore <= 49
  or any severe risk signal exists

warning:
  healthScore between 50 and 74
  or one or more warning diagnostics exist

normal:
  healthScore >= 75
  and no warning/risk diagnostics exist
```

Precedence:

1. `missing_data`
2. `risk`
3. `warning`
4. `normal`

## First Risk Signals

### 데이터 미수집

Trigger examples:

- missing sheet id
- permission denied
- missing required raw tab
- empty required raw tab
- blocking column mismatch

### 비용 급증

Trigger examples:

- spend materially higher than baseline
- spend increase without matching conversion or revenue increase

### 전환 급감

Trigger examples:

- conversions materially lower than baseline
- conversions are zero after meaningful spend

### CPC 상승

Trigger examples:

- CPC materially higher than baseline
- CPC high while CTR is flat or falling

### ROAS 하락

Trigger examples:

- ROAS materially lower than baseline
- revenue decreases while spend is stable or rising

### 전환 없는 고비용 구간

Trigger examples:

- spend exceeds internal review threshold
- conversions remain zero in the same segment/window

## v1 Exclusions

The metrics and health score rules are advisory only.

v1 must not include:

- bid change recommendation automation
- campaign edit automation
- budget movement automation
- automatic Naver Ads execution
- automatic customer-send reporting
- GEO
- RAG integration

## Implementation Notes For Later

Later implementation should separate:

1. raw connector data
2. normalized numeric metrics
3. calculated derived metrics
4. health score result
5. risk signals
6. UI view model

The UI should consume the prepared `AdsOperationsViewModel`; it should not calculate metrics directly from raw Google Sheets rows.
