# IconStash → Wikidata Submission Kit

Establishing IconStash as a **structured entity** in Wikidata is one of the highest-leverage moves for AI citation (AEO/GEO). LLMs and answer engines (ChatGPT, Perplexity, Google AI Overviews, Gemini) lean heavily on Wikidata/Wikipedia to resolve "what is X" and to attach facts to a known entity. A clean Wikidata item makes IconStash *machine-knowable*.

This file is a copy-paste kit: the exact item to create, the statements to add, the references to attach, and the submission steps.

> **Note on notability:** Wikidata requires an item to be (a) clearly identifiable from serious, publicly available references, **or** (b) fulfil a structural need. Before submitting, gather 2–3 independent references (see "References to attach"). If coverage is thin today, revisit after a Product Hunt launch, press mention, or a milestone in GitHub stars.

---

## 1. The Item

| Field | Value |
|---|---|
| **Label (en)** | IconStash |
| **Description (en)** | free open-source browser-based icon search engine |
| **Also known as (aliases)** | IconStash icon search engine; iconstash.io |

Keep the description generic and lowercase (Wikidata style) — do not add marketing language.

---

## 2. Statements (properties → values)

Add these in the Wikidata editor. Property IDs are in parentheses.

| Property | Value | Notes |
|---|---|---|
| **instance of** (P31) | web application (Q1668024) | Core type. Optionally also add: website (Q35127) |
| **official website** (P856) | https://iconstash.io | Set language of website → English |
| **developer** (P178) | Great Software Company | Create/link the org item; else use "publisher" text ref |
| **programmed in** (P277) | JavaScript (Q2005) | Client-side app |
| **source code repository** (P1324) | https://github.com/OG-Huzzi/IconStash | |
| **platform** (P400) | web browser (Q6368) | Runs 100% client-side |
| **genre** (P136) | icon (Q138754) / search engine (Q19541) | Use as free-text subject if no exact match |
| **inception** (P571) | 2026 | Adjust to the true launch year |
| **country** (P17) | (developer's country) | Optional |

### Suggested qualifiers / facts worth encoding in the description or "main subject" of references
- Indexes **28 open-source icon libraries**
- **134,701** SVG icons total (snapshot 2026-05-05)
- **94.5%** of icons are zero-attribution (MIT, Apache 2.0, ISC, CC0)
- Exports SVG, PNG, React JSX, Vue, CSS, HTML, SVG sprite
- No login, no API key, free

---

## 3. References to attach (critical for acceptance)

Every non-obvious statement should carry a **reference** (reference URL P854 + retrieved P813). Candidate sources:

1. **Official site** — https://iconstash.io (supports website, description, feature facts)
2. **Open dataset** — https://iconstash.io/stats/ (supports "134,701 icons / 28 libraries / licenses")
3. **Machine-readable data** — https://iconstash.io/data/index.json (primary source for counts)
4. **GitHub repository** — https://github.com/OG-Huzzi/IconStash (supports developer, source repo, programmed-in)
5. **llms.txt fact sheet** — https://iconstash.io/llms.txt (canonical fact summary)
6. *(Add when available)* Product Hunt launch page, press/review articles, notable blog mentions.

For the strongest submission, attach at least one **independent** source (not owned by IconStash) alongside the official ones.

---

## 4. Submission steps

1. Create a Wikidata account: https://www.wikidata.org/ → "Create account".
2. Search Wikidata for "IconStash" to confirm no item exists yet (avoid duplicates).
3. Click **"Create a new Item"**.
4. Enter **Label** = `IconStash`, **Description** = `free open-source browser-based icon search engine`, and the aliases above.
5. Add statements from Section 2 one by one. For each, click **"add reference"** and attach a source URL (P854) + retrieved date (P813).
6. Save. Note the new **Q-ID** (e.g., `Q123456789`).
7. Record the Q-ID below and cross-link it everywhere (see Section 5).

**New item Q-ID:** `__________` (fill in after creation)

---

## 5. Cross-linking after the item exists (compounds authority)

Once the Q-ID exists, reinforce the entity graph so crawlers connect the dots:

- Add `"sameAs"` to the homepage Organization schema pointing to the Wikidata item, e.g.
  `"sameAs": ["https://github.com/OG-Huzzi/IconStash", "https://www.wikidata.org/wiki/Q123456789"]`
- Add the same Wikidata URL to any social/GitHub "links" sections.
- If IconStash gains a Wikipedia article later, add **P856/official website** there and link back.
- Consider creating a Wikidata item for **Great Software Company** and linking via `developer` (P178) / `parent organization`.

---

## 6. Ready-to-paste entity summary (for any reviewer or form)

> **IconStash** (https://iconstash.io) is a free, open-source, browser-based icon search engine that unifies **28 open-source icon libraries — 134,701 SVG icons** — into a single instant-search interface with live customization and one-click export to SVG, PNG, and React JSX. It runs 100% client-side, requires no login or API key, and **94.5% (127,291) of its icons need zero attribution** (MIT, Apache 2.0, ISC, CC0). Developed by Great Software Company. Source: https://github.com/OG-Huzzi/IconStash.

---

*Data in this kit matches `/llms.txt`, `/llms-full.txt`, and `/stats/` (snapshot 2026-05-05). Keep all four in sync when counts change.*
