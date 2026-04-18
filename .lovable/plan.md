

# Full Website Audit Report — Tutors Parliament

**Mode:** Read-only audit. No code was changed.

---

## 1. Executive Summary — Top Issues

| # | Issue | Impact | Where |
|---|---|---|---|
| 1 | Footer "Start Free Demo" links to `/demo` (404) instead of `/demo-booking` | 🔴 Lost conversions on every page | `Footer.tsx:112` |
| 2 | "Become a Counsellor" card on `/counselling` points to `/become-a-tutor`, and `/register-counsellor` route doesn't exist (broken in 2 places) | 🔴 Broken funnel | `Counselling.tsx:71`, `AIEducationGuide` |
| 3 | "Privacy Policy" footer link is `href="#"` (dead link) | 🔴 SEO + trust + legal risk | `Footer.tsx:38` |
| 4 | CTA inconsistency: Navbar/Footer/Hero/StickyMobileCTA all push "Start Free Demo" even on `/counselling/*` pages whose own funnel is "Request a Callback" | 🔴 Funnel confusion | Global |
| 5 | Hardcoded "Delhi" / "Delhi NCR" everywhere despite "pan-India" positioning | 🟡 Contradicts SEO/messaging | Footer, TutorSeoPage, DecisionPage routes, Hero panel |
| 6 | `AIEducationGuide.tsx` canonical URL is `https://www.example.com/...` (wrong domain) | 🔴 SEO | Line 42 |
| 7 | Lead form's `CITY_OPTIONS` is a curated 32-city array — any other valid Indian city is rejected as invalid | 🟡 Form drop-off | `types.ts:156` |
| 8 | Hero `<img>` background is loaded as CSS `background-image` (no `loading`, no `width/height`) — likely LCP element with high CLS risk | 🟡 Core Web Vitals | `HeroSection.tsx:48-51` |
| 9 | `BlogPost` hero `<img>` missing `loading="lazy"` and width/height (CLS) | 🟢 CWV | `BlogPost.tsx:108` |
| 10 | OTP edge functions still exist but `ENABLE_OTP=false`; partial leads written with `otp_verified:false` and never cleaned up | 🟡 Data hygiene | `LeadCaptureFlow.tsx` |

---

## 2. URL Health Report

**Static pages (verified in `App.tsx`):** `/`, `/about`, `/courses`, `/counselling`, `/counselling/student`, `/counselling/parent`, `/counselling/personal`, `/blog`, `/blog/:slug`, `/faq`, `/tutors/:slug`, `/demo-booking`, `/become-a-tutor`, `/tutor-registry`, `/report-tutor`, `/exams/:slug`, `/ai-in-education-for-kids-guide`, `/contact`, `/terms-and-conditions`, 4× decision pages, catch-all `/:slug` → `TutorSeoPage`.

**Broken / wrong destinations:**
| URL referenced | Where | Problem |
|---|---|---|
| `/demo` | `Footer.tsx:112` | 404 — should be `/demo-booking` |
| `/register-counsellor` | mentioned in product spec & implied by `/counselling` card | Route never registered in `App.tsx` |
| `/become-a-tutor` (used as "Become a Counsellor" target) | `Counselling.tsx:71` | Misleading redirect |
| `#` (Privacy Policy) | `Footer.tsx:38` | Dead anchor |

**Duplicate / canonical issues:**
- `/:slug` catch-all also routes to `TutorSeoPage` → many URLs may render the same page (duplicate-content risk). No 404 for unknown slugs.
- `AIEducationGuide` canonical points to `www.example.com` (wrong).
- Decision pages have 4 separate routes all rendering the same `DecisionPage` component — confirm each sets a unique canonical (likely missing).

**Orphan pages (in routes but no nav link):** `/tutor-registry`, `/report-tutor`, all 4 decision pages, `/exams/:slug`, `/ai-in-education-for-kids-guide` (only linked from one section), `/terms-and-conditions` (linked only in footer).

---

## 3. CTA Audit

| CTA Text | Location | Target | Status |
|---|---|---|---|
| Start Free Demo | Navbar (desktop+mobile) | `/demo-booking` | ✅ Working — but wrong CTA on counselling pages |
| Start Free Demo | Footer | **`/demo`** | ❌ 404 |
| Start Free Demo | HeroSection button | `/demo-booking` | ✅ |
| Continue (hero form) | HeroSection | `/demo-booking?phone=...` | ✅ |
| Start Free Demo | StickyMobileCTA | opens `LeadCaptureModal` on Index, but `/counselling/*` pages also render it → context mismatch | ⚠️ Misleading |
| WhatsApp | StickyMobileCTA, WhatsAppButton, Footer | `wa.me` | ✅ |
| Get Expert Guidance | AntiAIInsight | `/counselling` | ✅ |
| Learn more about AI risks | AntiAIInsight | `/ai-in-education-for-kids-guide` | ✅ |
| Get Started | Counselling hero | scrolls to `#counselling-form` | ✅ |
| Become a Counsellor | Counselling card | **`/become-a-tutor`** | ❌ Wrong destination |
| Request Callback | Counselling/Student/Parent/Personal forms | `contact_messages` insert | ✅ |
| Book Demo / Get Free Demo | TutorSeoPage, DecisionPage, BlogCTA, SeoPageSections | `/demo-booking` | ✅ |
| Become a Tutor | Navbar, Footer, lazy CTA bar | `/become-a-tutor` or modal | ✅ but inconsistent (lazy bar opens modal, others navigate) |
| Chat on WhatsApp | Footer, FinalCTA | wa.me | ✅ |

**Inconsistency summary:**
- "Start Free Demo" CTA appears on counselling pages where the documented funnel should be "Request Callback" only.
- `WhatsAppButton` (floating) is no longer used on Index but is rendered on counselling pages → 3 stacked CTAs at the bottom on mobile (sticky bar + WhatsApp FAB + form).

---

## 4. Forms Audit

| Form | Page | Validation | Submission | Issues |
|---|---|---|---|---|
| Hero quick form (name+phone) | `/` | JS phone `/^[6-9]\d{9}$/` ✅ | Navigates to `/demo-booking?phone=...` | None |
| Lead Capture Flow (multi-step) | `/demo-booking` | Per-step JS, city must be in 32-item curated list or 6-digit pincode | Inserts to `leads` after Phone step; updates `step_reached`; final submit | 32-city list rejects valid Indian cities (Mysore, Coimbatore, Kochi, etc.). `INITIAL_LEAD_DATA` likely defaults `mode` empty — confirm. Partial leads with `otp_verified:false` accumulate. |
| Contact Form | `/contact` | Zod ✅ | `contact_messages` insert | Solid |
| Counselling callback (hub) | `/counselling` | Manual JS ✅ | `contact_messages` insert with synthetic `email: "not-provided@counselling.lead"` | Fake email pollutes table; should make `email` nullable or use distinct `inquiry_type` filter |
| Counselling callback (student/parent/personal) | `/counselling/*` | `CounsellingCallbackForm` reused | Same table | Same fake email issue |
| Lead Capture Modal | Index sticky | Wraps `LeadCaptureFlow` | Same as `/demo-booking` | Same |

**Validation inconsistencies:** Hero & Counselling form use `[6-9]\d{9}`; ContactForm Zod uses same pattern but allows empty (since phone optional) ✅. All consistent now.

---

## 5. Location & Dynamic Data Consistency

| Mismatch | File |
|---|---|
| Footer brand line: "**Delhi's** trusted platform" + "Serving **Delhi NCR**" + "New Delhi, India" address — contradicts pan-India counselling messaging | `Footer.tsx:99,108,249` |
| `TutorSeoPage` hardcodes `addressRegion: "Delhi NCR"`, `postalCode: "110001"` for ALL slugs and appends `-delhi` to every internal link | `TutorSeoPage.tsx:88-102, 343, 461, 473` |
| Decision page routes all suffixed `-delhi` | `App.tsx:63-66` |
| `DecisionPage` default CTA: "Get Free Demo Class **in Delhi**" | `DecisionPage.tsx:341` |
| `AIEducationGuide`: "Trusted by 5,000+ **Delhi/NCR** Parents" + keywords include "guided learning Delhi" | `AIEducationGuide.tsx:41,162` |
| Hero side-panel testimonial: "Priya M., New Delhi" hardcoded | `LeadCaptureFlow.tsx:319` |
| `CITY_OPTIONS` hardcoded 32 cities; rejects others as "invalid" | `types.ts:156` |

---

## 6. Breadcrumb & Navigation Check

- **Breadcrumb schema:** Present only on `/counselling/*` pages via `buildBreadcrumbSchema`. Missing on `/blog`, `/blog/:slug`, `/courses`, `/exams/:slug`, `/ai-in-education-for-kids-guide`, `/about`, `/contact`.
- **Visible breadcrumb UI:** Only `TutorSeoPage` renders one. Counselling, blog, courses don't show breadcrumbs to users despite having the schema.
- **Navigation:** Navbar dropdown for Counselling works ✅. No nav link to `/blog`, `/faq`, or `/become-a-tutor` (latter is only a button) — limits discoverability.

---

## 7. SEO & Meta Tags Audit

| Page | Title | Description | Canonical | OG | Schema |
|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ❌ missing | ✅ basic | Org + FAQ in `index.html` only (not via React route) |
| `/counselling` | ✅ | ✅ | ✅ | ✅ | Org + FAQ + Breadcrumb ✅ |
| `/counselling/student` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/counselling/parent` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/counselling/personal` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/ai-in-education-for-kids-guide` | ✅ | ✅ | ❌ **wrong domain (example.com)** | ✅ | ❌ no FAQ/Article schema |
| `/contact`, `/about`, `/courses`, `/faq`, `/blog`, `/blog/:slug` | needs verification | likely set via SEOHead | ❌ likely missing canonical | partial | mostly missing |
| `/tutors/:slug` & `/:slug` (catch-all) | ✅ dynamic | ✅ | ✅ | partial | LocalBusiness + FAQ ✅ but Delhi-only |
| Decision pages | needs check | needs check | likely missing per-route canonicals → duplicate-title risk | — | — |

**Heading hygiene:** Counselling page uses single H1 ✅. Hero on `/` uses H1 ✅. `TutorSeoPage` likely has multiple H1s (verify) — common SEO smell.

**Internal linking:** Cross-links exist between counselling pages ✅. But `/blog`, `/faq`, `/courses` not linked from counselling/AI guide → weak link equity.

---

## 8. Performance Report (Lighthouse-style, code-inferred)

**Render-blocking & bundle:**
- `App.tsx` lazy-loads all routes ✅ but eagerly imports `Index` and `NotFound`.
- `framer-motion` used in nearly every section — heavy. Consider tree-shaking or replacing simple uses with CSS.
- `Navbar` mounts `TutorRegistrationModal` always (modal closed but its tree exists).

**Images:**
- Blog list & related images use `loading="lazy"` ✅
- `BlogPost` hero image: no lazy, no width/height → CLS risk
- Hero uses CSS `background-image` for `heroImage` import → not eager-prioritized; LCP candidate is the H1 instead, which is fine, but image still ships full-size (no responsive `srcset`, no WebP confirmed).
- No `<img width height>` attributes in audited components → CLS risk on slow networks.

**Fonts:** `index.html` has preconnect to Google Fonts ✅, but no actual font preload (`<link rel="preload" as="font">`) — first paint may show fallback.

**Scripts:** `index.html` JSON-LD inline (org + FAQ) duplicates per-page schemas — fine but redundant.

**Network/CDN:** Supabase preconnect ✅. No DNS prefetch for WhatsApp/api.whatsapp.com.

**JS overhead:**
- Multiple scroll listeners (Navbar, ScrollTracker, BehaviorPopup) — confirm they use `passive: true` (Navbar ✅).
- `Navbar` triggers `window.scrollTo` on every route change (line 58) — animation cost.

**Page-wise estimate:**
| Page | Est. issue | Priority |
|---|---|---|
| `/` | Hero image not optimized; CLS from late-loaded sections; LCP likely H1 (OK) | Medium |
| `/demo-booking` | Heavy due to multi-step + framer-motion AnimatePresence; only loads what's needed | Low |
| `/counselling*` | Lightweight; main risk is unused `WhatsAppButton` mounting | Low |
| `/blog/:slug` | Hero img CLS; consider Markdown rendering cost | Medium |
| `/tutors/:slug` & `/:slug` | Heavy — many sections, schemas, related grids | Medium |

---

## 9. Priority Fix Recommendations

### 🔴 High Impact (do first)
1. Fix Footer `/demo` → `/demo-booking`.
2. Fix Counselling card "Become a Counsellor": create `/register-counsellor` route + page, OR change copy to "Become a Tutor" honestly.
3. Fix Privacy Policy link (create page or remove).
4. Fix `AIEducationGuide` canonical URL to `https://tutorsparliament.com/...`.
5. Make CTA hierarchy context-aware: on `/counselling/*` pages the navbar/sticky/footer CTA should be "Request Callback" not "Start Free Demo".
6. Decide pan-India vs Delhi positioning and unify Footer brand line, address, and `Serving Delhi NCR` strip.

### 🟡 Medium
7. Replace `CITY_OPTIONS` curated list with a permissive validator (any alpha string ≥ 3 chars OR 6-digit pincode) or a real autocomplete.
8. Add canonical tags + per-page SEOHead to `/`, `/about`, `/courses`, `/faq`, `/blog`, `/blog/:slug`, decision pages.
9. Add `width/height` to all `<img>` tags + `loading="lazy"` to non-LCP images (BlogPost hero, TutorSeoPage images).
10. Stop writing fake `email: "not-provided@counselling.lead"` — make `email` nullable in `contact_messages` and store NULL.
11. Remove the hardcoded "Delhi NCR" defaults from `TutorSeoPage` schema where slug doesn't carry a city.
12. Add Article + FAQPage JSON-LD to `AIEducationGuide` and BlogPost pages.

### 🟢 Low
13. Add breadcrumb UI (visible) to counselling, blog, and decision pages (schema-only is half the SEO value).
14. Preload primary heading/body fonts (`<link rel="preload" as="font" crossorigin>`).
15. DNS-prefetch `api.whatsapp.com`.
16. Conditionally mount `TutorRegistrationModal` only when opened.
17. Add a real `/admin` (password-gated) or export job for `leads`/`contact_messages` so partial OTP-skipped leads can be reviewed and pruned.
18. Remove unused OTP edge functions or document they're staged for re-activation.
19. Convert hero `background-image` to `<img>` with `fetchpriority="high"` + WebP `<picture>` for measurable LCP win.

---

## 10. What I Did NOT Change

Nothing. This audit is read-only. No files modified, no routes added, no schema edits. Each item above is actionable and can be picked up individually.

