# CEO review

**Mode: SCOPE REDUCTION.** The broad assistant premise is unvalidated and a public prototype should prove one outcome, not imitate a full HOA platform.

## Premise challenge

The actual outcome is a complete, reviewable application—not an AI conversation. Doing nothing preserves manager email load and homeowner resubmission, but the magnitude is still hypothetical. The plan should be killed unless direct observation shows recurring rework and paid pilots.

## Alternatives considered

1. **Minimal preflight (chosen)** — constrained questionnaire, deterministic citations, packet checklist. Effort S, risk low/medium. Fastest falsifiable wedge; limited project coverage.
2. **RAG resident chatbot** — conversational search across all documents. Effort M, risk high. Broader utility but weak trust, hard evaluation, and dangerous uncited answers.
3. **Full architectural-review system** — intake, payments, board voting, contractor/city integrations. Effort XL, risk high. Stronger workflow ownership but premature and incumbent-heavy.

## Eleven-section review

1. **Architecture:** Keep the evaluator deterministic and separate ingestion from serving. Every finding must pin a document version. Static demo/backend divergence is acceptable only while both consume the same fixture and are tested.
2. **Error/rescue map:** Invalid inputs → inline/422; missing rule fixture → visible 503; no applicable rule → explicit empty state in production; stale source → block “ready” state; upload/parser failure → review queue, never silent continuation.
3. **Security/threat model:** Highest risks are cross-tenant document exposure, malicious uploads, prompt injection in documents, and leaked homeowner artifacts. Require tenant-scoped authorization, scanning, encryption, retention, and model isolation before production.
4. **Data/interaction edges:** Nil/empty/wrong-range inputs are rejected. Double-click is blocked during screening. Production must preserve drafts on navigation, identify version conflicts, and expire stale results when a rule version changes.
5. **Code quality:** One domain operation, explicit models, and shared fixture are enough. Avoid a generic rules DSL until three associations expose stable variation.
6. **Tests:** Cover compliant/conflicting projects, validation, upstream fixture failure, checklist interaction, and mobile overflow. Add golden rule sets and tenant authorization tests before pilots.
7. **Observability:** Correction rate is the trust metric; cycle time and clarification messages are the value metrics. Generic engagement is a proxy and should not drive decisions.
8. **Database/state:** No demo persistence. Production needs immutable document versions, append-only correction history, tenant indexes, and artifact retention/deletion states.
9. **API:** A narrow `/screen` contract is correct. Add idempotency and authenticated application IDs only when persistence exists. Rate limits and payload caps precede uploads.
10. **Performance:** Rule evaluation is cheap. OCR, embeddings, and large PDFs are the likely hotspots; move ingestion async and precompute structured rules. Do not call an LLM on every resident keystroke.
11. **Design/UX:** Lead with status and blockers, show citations beside requirements, label the demo, and say “ready to package,” never “approved.” Mobile must not hide blockers or overflow.

## Decisions

- Ship the preflight vertical slice only.
- Remove generic chat, city code, and autonomous submission from the MVP.
- Make all results cited, versioned, and correctable.
- Use a paid concierge pilot rather than a waitlist as the next test.
- Keep Python deployable but explicitly offline until hosting/security are approved.

**Strongest challenges:** no direct demand evidence; stale/incorrect-rule liability; setup labor may erase margins.

**Accepted scope:** three project types, deterministic screen, citations, blockers, checklist, API tests, static interactive demo.

**Deferred:** document ingestion, authentication, persistence, manager review UI, integrations, AI-assisted extraction.

**Not in scope:** legal advice, city permitting, HOA decisions, production data, live backend.
