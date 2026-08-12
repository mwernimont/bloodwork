# Development Guide

## What this app is

A story visualizer for a single writer (just Marty, no multi-user/auth planned). The core loop: write chapters with fast, in-place reference access to the characters and world you've built — no more tabbing between Google Docs to look something up. Longer-term, the world data (characters, locations, events) also renders visually: a relationship web for characters, a spatial map with pins for locations.

## Data model

### Project — ✅ built
Top-level container for a story. `name`, `description`, `created_at`.

### Character — ✅ built (backend)
`id`, `project_id`, `name`, `metadata JSONB`, `created_at`. Freeform fields (archetype, home, weapon, etc.) live in `metadata` rather than as columns, since the set of fields is open-ended and none of them need DB-level constraints or joins.

### Character Relationship — designed, not built
Self-referential many-to-many join table — a character can relate to many characters and vice versa.
```sql
character_relationships
    id
    character_id          -- FK → characters.id, ON DELETE CASCADE
    related_character_id  -- FK → characters.id, ON DELETE CASCADE
    relationship_type     TEXT  -- free text (e.g. "sibling", "rival", "mentor")
    created_at
```
Open question: directional vs. symmetric relationships (e.g. "mentor of" isn't the same fact from both sides) — decide when building this.

### Location — designed, not built
Hierarchical (continent → region → kingdom → city, etc.) via a single self-referencing parent column — not many-to-many, since each location has exactly one parent.
```sql
locations
    id
    project_id
    name
    location_type        TEXT     -- free text (continent, region, kingdom, city, ...)
    parent_location_id   -- nullable FK → locations.id
    is_capital            BOOLEAN NOT NULL DEFAULT false  -- real column: needs to be searchable
    metadata               JSONB NOT NULL DEFAULT '{}'
    created_at
```
`is_capital` is a real column (not metadata) specifically so "what's the capital of X" / "list every kingdom and its capital" is a plain, fast query instead of a JSONB scan.

### Chapter — not yet designed in detail
Ordered writing content per project. Known: needs a sequence/ordering field so chapters display in the right order. Exact columns TBD when we build it.

### Event — not yet designed in detail
Its own entity (e.g. "Battle of 1441"), not folded into metadata, because it needs real relationships: which location it happened at, which characters were involved. Likely shape: an `events` table plus an `event_characters` join table (many-to-many, same pattern as character relationships). Exact columns TBD.

### Map — last priority
A visual/spatial map: an image with pins placed at Location coordinates. Requires new backend capability the app doesn't have yet — file/image upload and storage. Deliberately sequenced last: the Location *data* it depends on gets built in an earlier phase regardless, and it's the most technically novel piece (nothing else in the app handles file uploads).

## Build order / checklist

Roughly sequenced so there's something usable (write + reference lookup) well before the more visual pieces exist.

- [x] Project CRUD (backend + frontend list/add/delete)
- [x] Character schema + backend routes (`003_add_characters.sql`, `characters.js`, mounted in `server.js`)
- [ ] Character frontend (list/add/delete UI on a project page)
- [ ] Location schema + backend routes (mirror the Character pattern)
- [ ] Location frontend (searchable list UI)
- [ ] Chapter schema + backend routes (design columns first)
- [ ] Chapter frontend (writing area)
- [ ] Three-pane project view: left = character search, middle = chapter writing, right = location search; click a search result → small card → click card → in-place scrollable detail view (no navigating away from the writing area)
- [ ] Character Relationship schema + backend routes
- [ ] Character relationship web view (visual graph on a character's page)
- [ ] Event schema + backend routes (design columns first)
- [ ] Event UI (create/link to characters + locations)
- [ ] Map: image upload/storage + pin placement referencing Location coordinates
- [ ] Map UI (view map, click pins → location detail)

## Open questions (revisit when building that piece)

- Character Relationship: directional or symmetric relationships?
- Chapter: exact columns, and whether chapters ever link to characters/events ("who appears in this chapter")
- Event: exact columns, and whether an event can span multiple locations or just one
- Map: single map image per project, or multiple (e.g. a world map + separate city maps)?
