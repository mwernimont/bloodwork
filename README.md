# bloodwork

## Database

The backend (`backend/`) uses Postgres (via Docker Compose) with [Prisma](https://www.prisma.io/) as the ORM — no raw SQL.

- **Start Postgres**: `docker compose up -d` (from `backend/`), or just run `npm run dev` from the repo root, which starts it automatically.
- **Schema**: `backend/prisma/schema.prisma` is the source of truth for tables/models. Edit it to add or change a model.
- **Create/apply a migration**: after editing the schema, run `npm run db:migrate` from `backend/` (wraps `prisma migrate dev`). It prompts for a migration name, generates SQL into `backend/prisma/migrations/<timestamp>_<name>/`, applies it to the local dev DB, and regenerates the client. Never hand-edit an already-applied migration folder — add a new one instead.
- **Regenerate the client only**: `npm run db:generate` (from `backend/`). Not usually needed manually — it also runs automatically before `npm run dev`/`npm run start` via `predev`/`prestart` hooks.
- **Generated client**: lives at `backend/src/generated/prisma/` (gitignored, not committed).
- **Local credentials**: `bloodwork`/`dev`, defined in `backend/docker-compose.yml` and `backend/.env` (`DATABASE_URL`). Data persists in a named Docker volume across restarts, but is local-dev-only — treat it as disposable.