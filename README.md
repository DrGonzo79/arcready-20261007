# ArcReady

A runnable prototype for cited HOA architectural-request preflight. Homeowners describe a project, see deterministic rule conflicts, and complete a packet checklist. All visible data is fictional.

## Run the frontend

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The static production export is produced by `npm run build` in `out/` and supports a GitHub repository base path.

## Run and test the Python API

```bash
uv sync --project api --locked --dev
uv run --project api uvicorn api.main:app --reload
uv run --project api pytest api/tests
```

Example operation: `POST /screen` with `{"project_type":"Fence","height_feet":6,"material":"Cedar","shared_property_line":false}`.

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
uv run --project api pytest api/tests
```

## Deployment boundary

GitHub Pages hosts the frontend only. FastAPI is runnable and tested source but is **not deployed**. The demo does not submit applications, contact an HOA, or provide legal advice.

See [product plan](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md), [opportunity score](docs/OPPORTUNITY_SCORE.md), and [source notes](research/notes.md).
