# Architecture

## Demo

```text
Next.js static UI
  ├── project form + validation
  ├── deterministic TypeScript screening
  └── shared fictional JSON rules

FastAPI source (not deployed)
  ├── Pydantic validation
  ├── deterministic screening operation
  └── same fictional JSON rules
```

GitHub Pages serves only the static frontend. The FastAPI backend is independently runnable and integration-tested.

## Production direction

```text
Resident UI → API gateway/auth → application service → rule evaluator → Postgres
                                     │                    ├── findings/audit
Manager UI ──────────────────────────┘                    └── versioned rules
Document upload → malware scan → OCR/extraction → review queue → object storage
```

Tenant ID is derived from authenticated membership, never accepted from resident input. Documents and artifacts use encrypted object storage and short-lived references. Every finding records the rule/document version. A source outage or parse failure is visible; the evaluator never falls back to an uncited model answer.

## API contract

`POST /screen` accepts `project_type`, `height_feet`, `material`, and `shared_property_line`; it returns status, cited findings, blockers, and required documents. Invalid types/ranges return 422. Missing or malformed fixtures return 503. `GET /health` reports process health only.

## Observability

Production signals: request latency/error rate, abstention rate, findings per application, manager correction rate by rule, stale-document alerts, packet completion rate, clarification messages, and acceptance-for-review cycle time. Alert on tenant-boundary failures, source-version mismatch, a correction-rate spike, and rule-load failure. The demo intentionally has no telemetry.
