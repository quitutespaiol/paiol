# paiol

Cost, recipe, and sales management for a Brazilian MEI confeitaria — **Quitutes do Paiol**.
Local-first, single-file, auditable-forever.

See [`paiol-spec-v0.1.md`](./paiol-spec-v0.1.md) for the full design.

## Run it

```sh
npm run dev      # serves http://localhost:8080/ (native ES modules, no build step)
npm test         # run the test suite (node --test, zero deps)
npm run build    # inline everything → paiol.html (single-file deploy)
```

Open <http://localhost:8080/> — that exact URL is also the registered Dropbox OAuth
redirect, so "Conectar ao Dropbox" works in local dev.

## Deploy

Live at <https://quitutespaiol.github.io/paiol/> via GitHub Pages — a project site for this repo.
**Deployment is automatic:** pushing
to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
the single file and publishes it (no manual steps, no separate hosting repo).

The single file is self-contained (everything inlined). Before enabling Dropbox, create an
App-folder Dropbox application owned by Quitutes do Paiol, enable `files.content.read`,
`files.content.write` and `files.metadata.read`, register the exact OAuth redirect
`https://quitutespaiol.github.io/paiol/`, and put its public App key in `src/config.js`.
The old Gentropic Dropbox App key must not be reused. Business data is never committed to
GitHub; import the complete YAML backup in Ajustes on the new site before connecting Dropbox.

## Layout

```
src/
  domain.js        domain types (§2) as JSDoc
  units.js         unit conversions + per-ingredient override graph (§3)
  cost-engine.js   cost engine: DAG roll-up, estimate/actual lens, MEI markup (§4)
  store.js         append-only event store, union-by-id merge, canonical YAML
  finance.js       receivables/payables, settlements, chart of accounts, cash flow
  yaml-bridge.js   JS value <-> @gcu/yaml
  persist.js       backend-agnostic persistence over @gcu/vfs (§5)
  dropbox-auth.js  PKCE OAuth (no secret) + token manager
  sync.js          pull / union-merge / push against any VFS (Dropbox in prod)
  auth-flow.js     browser glue for the Dropbox redirect
  app.js / ui.js / main.js   boot + PT-BR UI
vendor/@gcu/       vendored, pinned libraries (see vendor/README.md)
tools/dev-server.js   zero-dep static dev server
build.js              single-file builder
```

Code identifiers are English; every label the user sees is Portuguese.

## Finance ERP

The Financeiro module centralizes the financial dashboard, accounts receivable and
payable, partial settlements, chronological entries, actual/projected cash flow,
purchases, suppliers, cash accounts, chart of accounts and management reports.
Operational orders remain authoritative: an encomenda creates one linked receivable,
its existing payment history is reused, and desistências are cancelled without deleting
their history. Purchases update the ingredient price and create one linked payable.

The migration to schema version 2 is additive. Existing recipes, products, comandas,
orders, payments, losses and pricing simulations are preserved.

## License

CC0 / MIT.

This repository was prepared from the public `gentropic/paiol` source at commit
`fbeab9b4215ca9d621b0f338e3132b8977c8d4d7`. The original package credits
Arthur Endlein Correia. Bundled third-party code retains its license files under `vendor/`.
