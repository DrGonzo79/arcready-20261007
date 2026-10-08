# ArcReady product plan

## Thesis

Architectural-review pain is not primarily a conversational problem. It is a provenance and packet-completeness problem. ArcReady turns versioned HOA rules into an auditable preflight: a resident describes a project, sees conflicts with citations, and completes the exact packet a manager needs.

## ICP and JTBD

- **Buyer:** portfolio community-association manager overseeing 10–30 HOAs, starting with associations processing at least 15 architectural requests per month.
- **User:** homeowner planning a common exterior project with a contractor start date.
- **JTBD:** “Before I submit or schedule work, tell me exactly which current rules apply and what evidence the committee needs so I do not lose a review cycle.”
- **Status quo:** PDFs, shared drives, generic forms, manager email, board memory, and resubmission.

## MVP wedge

One association, three project types (fence, patio, solar), manager-reviewed rule ingestion, structured project questionnaire, deterministic conflict checks, cited findings, packet checklist, and manager correction log. Charge $750 setup and $149/month only after a concierge pilot proves time saved or rework reduced.

Not in MVP: generic resident Q&A, city permitting, legal interpretation, autonomous approval, payments, contractor marketplace, or board voting.

## Workflow

1. Manager uploads current governing documents and identifies effective dates.
2. Human reviewer converts requirements into structured rules; manager approves them.
3. Resident selects a project type and supplies constrained facts.
4. Rule engine returns applicable citations, blockers, and required evidence.
5. Resident completes the checklist; manager reviews the assembled packet.
6. Corrections become structured rule feedback, never silent model memory.

The prototype implements steps 3–5 with explicit fictional fixtures and two working interactions: project screening and checklist progress.

## Data model

- `Association(id, name, jurisdiction, manager_org_id)`
- `Document(id, association_id, title, version, effective_at, sha256, review_status)`
- `Rule(id, document_id, citation, project_type, predicate, requirement, severity)`
- `Property(id, association_id, address_ref, resident_id)`
- `Application(id, property_id, project_type, answers, status, created_at)`
- `Finding(id, application_id, rule_id, outcome, explanation)`
- `Artifact(id, application_id, kind, object_ref, review_status)`
- `Correction(id, finding_id, actor_id, previous_value, new_value, reason, created_at)`

PII and files require tenant isolation, retention controls, access logs, and encryption before production use. The demo persists nothing.

## Technical architecture

Static Next.js UI → typed screening request → FastAPI boundary → deterministic rule evaluator → versioned rule store. Document ingestion is an offline/admin path: OCR/parser → candidate clauses → human review → structured rules. Production would use Postgres with row-level tenant boundaries and object storage for source documents/artifacts. The static GitHub Pages demo duplicates the same rule logic client-side against a shared JSON fixture; the Python implementation is runnable source, not a live backend.

## AI/model strategy

AI may suggest clause extraction, normalize document language, and draft plain-English explanations. It must never be the authority. Retrieval is scoped to the association and effective document version; every resident-facing answer requires a citation. Low-confidence extraction enters manager review. Deterministic predicates decide supported project checks. Measure citation precision, rule-recall on a labeled set, correction rate, and abstention quality before any generative answer reaches residents.

## Economics

Hypothesis: 15 requests/month × 20 minutes of avoidable manager handling × $35 loaded hourly cost ≈ $175/month of direct labor, before resident satisfaction and cycle-time value. That makes $149/month plausible but unproven. Setup must cover document review; at four reviewer hours × $60, a $750 fee yields room for acquisition/support. Kill or reprice if median setup exceeds eight hours, monthly support exceeds one hour per association, or fewer than three of ten qualified managers accept a paid pilot.

## Distribution and GTM

Start with regional community-management firms, CAI chapter vendors, HOA attorneys, and architectural-review service providers. Sell the measurable wedge: “reduce incomplete fence/patio/solar packets,” not “AI for HOAs.” Founder-led outreach offers a paid 30-day concierge pilot using recent anonymized applications. Case studies compare handling time, clarification messages, and acceptance-for-review rate.

## Validation plan

1. Interview/watch five portfolio managers process a recent request unassisted.
2. Collect three redacted rejected and three accepted packets plus current rules.
3. Manually produce preflights; compare against manager judgment and committee intake.
4. Offer ten qualified managers the $750 + $149/month pilot.
5. **Success:** 3 paid pilots, ≥30% fewer clarification messages, ≥25% faster manager handling, and zero uncited findings across 30 applications.
6. **Kill:** 0 paid pilots, source access refused by >70%, or manager correction rate >10% after initial setup.

## Moat

The interface and LLM prompts are commodities. Potential defensibility comes from manager-approved structured rule libraries, document-version lineage, correction history, labeled application outcomes, and workflow integrations. None exists yet. Do not claim a moat until correction data improves accuracy and switching costs.

## Risks

- Incorrect or stale rules delay or mislead projects.
- HOA and city requirements can conflict; the wedge excludes city code.
- Files can contain addresses, signatures, and neighbor data.
- Fair-housing concerns and inconsistent board enforcement require auditability.
- “Ready” can be mistaken for approval; language must remain “ready to submit for review.”
- Incumbent HOA suites may bundle forms and document search.
- Setup/support labor can destroy software margins.

## 30/60/90 days

- **Days 0–30:** five observations, six labeled historical packets, deterministic three-project rule schema, ten paid-pilot offers.
- **Days 31–60:** run up to three paid pilots, instrument handling time/corrections, add manager rule review and document-version alerts.
- **Days 61–90:** decide kill/continue from thresholds; if continued, add tenant isolation, audit export, one management-suite handoff, and a second association per customer.
