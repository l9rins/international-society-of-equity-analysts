# ISEA Website — Handoff

Handoff notes for the next session working on this repo. Last updated 2026-09-24.

## What this project is

Static website for the International Society of Equity Analysts (ISEA). Plain HTML/CSS/JS, no build step, no framework.

- 21 root pages (`index.html`, `about.html`, `membership.html`, `apply.html`, `code-of-ethics.html`, `policies.html`, the legal pages `terms/privacy/cookies/disclaimer/accessibility.html`, etc.) plus `members/dashboard.html`.
- `css/styles.css` and `js/main.js` are shared by every page.
- `policies/<slug>.html`: the 21 policy texts as HTML fragments. `policies.html` fetches one when a reader clicks "Read Online", so the site must be served over HTTP. Opening the file directly shows a "could not be loaded" fallback.
- `documents/*.pdf` and `documents/policies/*.pdf`: the 27 official PDFs behind the "Download PDF" links. **Never edit, regenerate or replace these. The owner produces them.**
- `documents/*.docx` (including the audit, `ISEA WEBSITE AUDIT.docx`) are git-ignored and exist only on the owner's machine.
- `_internal/` is git-ignored and holds internal commercial files that must never be published.

Local preview: `python -m http.server 8765` in the repo root, then open http://localhost:8765.

## Branch state

- Work lives on **`audit-fixes-2026`**. It has **not** been merged into `main`.
- Commits on the branch (hashes will change if the owner rewrites history; see below):
  - `5b68ebe`: audit fixes, Formspree wiring, mobile layout, document dates (earlier session)
  - `409e5e7`: nav dropdown toggles as real `<button>`s with `aria-expanded` / `aria-controls`
  - this handoff file
- Merge command (**only when the owner asks**):
  `git checkout main && git merge --ff-only audit-fixes-2026`

## Owner's working rules (follow these)

1. Work only on `audit-fixes-2026`. Never commit to, merge into or push `main` unless the owner explicitly asks.
2. Don't rewrite git history yourself (no rebase, amend, reset or force) unless explicitly asked.
3. Never edit, regenerate or replace any PDF.
4. One commit per fix, with a clear message.
5. The nav block must be identical on all 21 pages. Change it everywhere, then verify with a hash (see Verification). `404.html` uses root-absolute paths (`/about.html`), so strip the leading `/` before hashing.
6. If information or a decision is missing, stop and ask. Never invent content, dates or wording.
7. No new libraries or frameworks. Plain CSS/JS in the existing style, with shared styles in `css/styles.css`.
8. Prove every claim with a command and its output. If a check wasn't run, write "not verified".

## Open security item: the owner is handling it

Early commits on `main` (already on the public GitHub remote) contain internal files that have since moved to `_internal/`. The owner will rewrite history to remove them and force-push. After that, **every commit hash changes**, and any existing clone must be deleted and re-cloned rather than pulled. Don't do this yourself unless asked. Automated attempts in the last session were blocked by the tool's safety check.

## Audit status (source: `documents/ISEA WEBSITE AUDIT.docx`, written by Soleil)

Verified done on the branch:
- Nav identical on all pages. "Board of Governors" / "Advisory Committees" replaced with "Governing Council" / "Global Standing Committees". The Directory link points to `membership.html#directory`. Contact Us is in the nav and every footer.
- Dropdowns open on hover, keyboard focus (`:focus-within`) and click/tap. Escape closes one and returns focus to its toggle; an outside click closes it. Tested in a browser at desktop and mobile widths.
- CFA references removed from the website (FAQ, Apply MISEA/FISEA, CFA domain links).
- Word TOC field codes removed. Run-on lists converted to `<ul>` everywhere the audit names them: Code of Ethics standards 1.3, 2.1, 2.2, 2.5, 3.2, 5.2, 5.3, 6.6, 8.1, 13.2, 15.3, 16.2 and 17.2, "Integrity of Research", Parts III/IV, the Apply page lists, and Anti-Fraud Definitions / Scope.
- "Download PDF" buttons are real `download` links. The window.print buttons are gone.
- Drafting notes removed from the Terms and Privacy **web pages**.
- Contact page: Brisbane is the Global Secretariat and registered office; New York is the North America Representative Office.
- Four separate application forms on `apply.html`. The Directory is search-only, with a 3-character minimum.
- Events countdown is live. "Register", "Read Full Statement", the blog filters and "Forgot password" all work (the last opens a "Request Sign-In Help" form).
- Mobile layout: no horizontal overflow on any page at 320, 375, 414, 600, 700, 768 or 1366 px (checked last session).

Document dates: each page's **Version / Approved / Last Updated matches its PDF exactly**; a script compared all 27 and found 0 mismatches. Last Updated is 1 July 2026 everywhere. Approved is 1 July 2026 for the Code of Ethics and 10 policies (Complaints, Conflict of Interest, CPD, Disciplinary, Document Retention, Ethics, Membership, Risk Management, Whistleblower, and the Code itself), and 1 July 2025 for the rest, as in their PDFs. The owner confirmed 2026 is correct for the Code of Ethics, even though the audit had asked for 2025.

The owner confirmed these are **correct as they are**: the About timeline years (2025) and the press release dateline (1 July 2025) in `news.html`.

## Still open

Owner is handling:
- Re-exporting 3 PDFs that still contain problems: `terms-of-use.pdf` (a drafting note in the Limitation of Liability clause), `privacy-policy.pdf` (a drafting note under Automated Decision-Making) and `policies/whistleblower-policy.pdf` (a CFA reference in 4.2). Filenames stay the same.

Waiting on the client:
- Approved wording to replace "Research Objectivity Standards" and "Best Practice Guidelines…" in the Membership page's Code of Ethics section (`membership.html`, around line 232).
- The real homepage counter figures (they currently show 0).
- Sponsor logos and details (the "Your Institution Here" placeholders).
- Consent from the members listed in the public registry.
- The Insights Blog articles (all six are "Coming Soon").

Waiting on the owner's decisions (asked, no answer yet):
1. Keep or revert the Phase 2 work the earlier session added: Formspree wiring on 8 forms, the Sign-In Help form replacing password reset, and the directory 3-character minimum.
2. Keep the beyond-audit changes: SEO (canonical tags, `robots.txt`, `sitemap.xml`, noindex), skip link and `<main>`, modal focus handling, `defer` and lazy images, mobile layout fixes, and versions 1.2 → 1.0 on the Cookie and Accessibility pages.
3. Which design/UX proposals to implement (Stage 2 is gated on approval). The last session recommended 1, 2, 3, 4, 10, 12 and 16, plus 5, 7, 13 and 18:

| # | Issue | Proposal |
|---|---|---|
| 1 | Nav overflows between 993 and about 1279 px; search and Member Login are off-screen | Use the hamburger menu below 1280 px, or tighten nav spacing |
| 2 | Floating social-icon rail overlaps content below about 1366 px | Hide it below 1366 px (the links are also in the footer) |
| 3 | No visible `:focus-visible` style; inputs use `outline: none` | One consistent gold focus ring |
| 4 | No `prefers-reduced-motion` support anywhere | Reduced-motion block |
| 5 | Hero parallax runs on an unthrottled scroll listener | Remove it, or use rAF and respect reduced motion |
| 6 | `.fade-in` reveals never play (JS marks everything visible at load) | IntersectionObserver reveal: opacity plus a 12 px rise, 500 ms, gated by a JS class |
| 7 | Transitions use `transition: all` | Animate only opacity and transform |
| 8 | No button press feedback | `:active` scale 0.98 |
| 9 | Every `.card` lifts on hover, even ones that aren't clickable | Lift only link cards |
| 10 | Tap targets under 44 px on mobile | Bigger hit areas with no visual change |
| 11 | Heading level skips on 9 pages; login has no h1 | Fix the levels, keep the look |
| 12 | Legal and Code of Ethics pages are 13k–27k px tall | "On this page" contents using the existing `.side-nav` |
| 13 | Legal hero Download PDF is left-aligned on mobile | Centre it |
| 14 | Breadcrumbs wrap mid-phrase on mobile | Keep them on one line |
| 15 | Forms only show browser validation pop-ups | Styled invalid state |
| 16 | Mobile menu has no focus trap or Escape | Add both |
| 17 | 200–550 inline styles per legal page | Move them into classes |
| 18 | Mixed border-radius values | Use the tokens |

Animation rules for Stage 2 (from the owner): animate only `transform` and `opacity`; 150–300 ms for micro-interactions and at most 600 ms for entrances, ease-out; wrap everything in `prefers-reduced-motion`; use IntersectionObserver, not scroll listeners; content must stay visible if JS fails; keep motion subtle, with no bouncing or spinning.

Not verified: text contrast over hero photos and on the gold testimonial avatar. All other text passed WCAG AA at 375, 768 and 1440 px.

## Phase 2 (deferred): do not touch

- The Formspree placeholder `YOUR_FORMSPREE_ENDPOINT_HERE` on 8 forms. In preview mode forms show success but send nothing.
- The simulated member login, and direct access to `members/dashboard.html`.
- Directory data exposed in the page source.
- The cookie banner (Accept only; EU consent rules).

## Verification (re-create these checks; last session's scripts were temporary)

- **Nav hash:** for each root page, take the text from `<nav class="nav" id="mainNav">` to the first `</nav>`, remove the `active` class and the leading `/` in paths, and MD5 it. All 21 hashes must be equal.
- **Links:** every `href`, `src` and `action` must resolve to a file, and every `#anchor` to an `id`. `policies.html#<slug>` counts as valid if `policies/<slug>.html` exists.
- **Leftovers:** `grep -rn "members-directory\|PAGEREF\|_Toc" --include=*.html .` should return nothing.
- **PDF dates:** Word-exported PDFs have readable text. Inflate each stream with `zlib`, join the `TJ`/`Tj` strings, and read the block after "ADMINISTERED BY" (version, approved, last updated).
- **Browser checks:** the preview pane throttles CSS transitions when it isn't focused, so inject `*{transition:none!important}` before reading computed visibility, or click into the page first.
