# Phased build prompts

1. **Pilot data model:** Add Postgres tenant, association, immutable document-version, rule, application, finding, artifact, and correction records. Prove tenant isolation and migration rollback with tests.
2. **Manager rule review:** Build authenticated document upload, malware scan, parser queue, clause suggestions, side-by-side citation review, effective dates, and publish/rollback. No resident answer may use unpublished rules.
3. **Resident packets:** Persist drafts, generate a review PDF with citations, support secure artifact uploads, expose stale-result warnings, and add audit export. Test navigation loss, duplicate submissions, expired links, and mobile uploads.
4. **Measured pilot:** Add privacy-preserving metrics for handling time, clarification messages, corrections, completion, and acceptance-for-review. Create alerts/runbooks for rule-load failure, stale documents, and tenant-boundary violations.
5. **AI assist after evidence:** Evaluate clause extraction on a labeled corpus. Require citation precision/recall thresholds, abstention, prompt-injection tests, human review, and cost caps before enabling it for any customer.
