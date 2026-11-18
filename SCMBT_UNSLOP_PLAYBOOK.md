# SCMBT High-Craft Institutional Playbook
> **Derived from Gate 5 (Legacy Exam Migration) & Gate 6 (Faculty Class Roster)**  
> **Standards for Eliminating AI Slop, Header Bloat, and Crowded Text**  
> *Southwestern College of Maritime, Business and Technology*

---

## 1. Executive Summary & Core Philosophy

This Playbook codifies the design transformations that brought **Gate 5 (Legacy Exam Migration)** and **Gate 6 (Faculty Class Roster)** to unanimous user approval.

When AI models design software, they default to **"over-embellished AI slop"**:
- Stacking 3–4 rows of colorful pill badges.
- Writing patronizing paragraphs explaining obvious UI buttons.
- Cramming multiple disparate data points and inline forms into a single table cell.
- Forgetting to make modals scrollable, clipping content at the bottom.

**The SCMBT High-Craft Principle:**
> *"The interface is an institutional instrument, not a marketing landing page. High craft is defined by optical clarity, high-density tabular typography, and intentional restraint."*

---

## 2. The 6 Foundational Rules

### Rule 1: The "1 Title + 1 Subline" Header Rule
*No exceptions. Every page header card must conform to this structure.*

```html
<!-- ✅ CORRECT: SCMBT Standard Header -->
<header className="page-header-card">
  <div className="header-meta-left">
    <h1 className="header-title">NAV 101: Terrestrial Navigation 1</h1>
    <p className="header-subline">Section BSMT 1-Alpha • Capt. Eduardo Morales, MM</p>
  </div>
  <div className="header-actions-right">
    <button className="btn-primary">[Print Roster]</button>
  </div>
</header>
```

- ❌ **Delete Filler Badges**: Never stack `Directorate`, `Gate X`, `Accreditation`, `Version` pills above the title.
- ❌ **Delete Instructional Prose**: Never write *"Click Details on any student to view full category breakdowns..."*.
- ❌ **Delete Metadata Inflation**: Do not put room numbers, schedule strings, or PRC licenses in the header banner. Keep them in printouts, modals, or info drawers.
- ✅ **Single H1 + Single Subline**: 1 concise heading + 1 line of essential metadata.
- ✅ **Header Height Cap**: The header must never exceed `80px` in desktop height, preserving the screen fold for actual data.

---

### Rule 2: Pure Value Table Architecture (Zero Cell Crowding)
*Tables must be dense, legible, and uncluttered.*

- **Pure Metrics Over Labels**:
  - ❌ Bad: `Score: 81.9% (Passed / Grade A)`
  - ✅ Good: `81.9%` with `tabular-nums`
- **Dual-Track Columns for Dual Assessments**:
  - Separate `Entrance Exam` and `Aptitude Test` into distinct columns.
  - If a student lacks a score, show a compact action button: `+ Input`.
- **Modals as Gateways (Never Inline Clutter)**:
  - Do not expand 10 subcategories or clinical paragraphs inside a table row.
  - Provide a single, consistent `[Details]` or `[View Dossier]` action button that opens a complete, full-fidelity modal dialog.
- **Strict Role Boundaries**:
  - Keep each page focused on its actual institutional purpose. (e.g., A Class Roster is an enrollment roll, NOT an active midterm/final grading spreadsheet).

---

### Rule 3: Non-Clipping, Full-Height Scrollable Modals
*Every modal dialog must guarantee full accessibility of all content.*

```css
/* ✅ CORRECT: Scrollable Modal Architecture */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-body-scroll {
  overflow-y: auto;
  flex: 1 1 auto;
  padding: 24px;
}

/* Ensure inner cards never compress and clip text */
.modal-body-scroll > * {
  flex-shrink: 0;
  width: 100%;
}
```

- ❌ Never suppress scrollbars globally (`* { scrollbar-width: none; }`).
- ✅ Suppress scrollbars *only* on the outer application frame (`html, body, #root`), never inside modals or tables.
- ✅ Always provide `flex-shrink: 0` on modal cards to prevent bottom cut-offs (e.g., student clinical paragraphs and evaluator signatures).

---

### Rule 4: Standardized Status Triad
*Status badges must be high-contrast, predictable, and scannable.*

| Status | Background | Border | Text | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Pending** | `#FEF3C7` (Amber-100) | `#FDE68A` | `#92400E` | Awaiting examination or review |
| **Approved / Official** | `#ECFDF5` (Emerald-50) | `#A7F3D0` | `#065F46` | Cleared requirement / Enrolled |
| **Rejected / Conditional**| `#FEF2F2` (Red-50) | `#FECACA` | `#991B1B` | Disqualified / Retake required |

---

### Rule 5: Tabular Numerics Everywhere
*Numbers must not jitter or misalign vertically.*

- Apply `font-variant-numeric: tabular-nums` (or CSS class `tabular-nums`) to:
  - All Student IDs (`2024-00102`)
  - All percentage scores (`88.5%`)
  - All percentiles and stanines (`Stanine 6`, `78% PR`)
  - All countdown timers (`89:45`)
  - All dates and reference codes (`2024-07-15`, `REF-2024-8891`)

---

### Rule 6: Color Restraint (SCMBT Brand Tokens)

| Token | Hex | Role |
| :--- | :--- | :--- |
| `navy-primary` | `#042B4E` | Primary headings, active tab highlights, primary CTA fills |
| `amber-accent` | `#F98809` / `#F59E0B` | Secondary accents, warning badges, subtle active focus rings |
| `canvas-bg` | `#F1F5F9` | Master page background behind floating containers |
| `surface-white` | `#FFFFFF` | Table backgrounds, modal dialogs, sheet surfaces |
| `border-subtle` | `#E2E8F0` | Structural dividers, 1px table borders |
| `text-primary` | `#0F172A` | High-contrast body copy and table metrics |
| `text-muted` | `#64748B` | Secondary timestamps, column headers, metadata sublines |

---

## 3. Page Audit & Application Matrix

| Page / Gate | Pre-Playbook Issues | Playbook Transformation Applied |
| :--- | :--- | :--- |
| **Gate 1: Exam Bank** (`/guidance/exam-bank`) | Stacking department banner, multi-line paragraph explaining settings, wordy category tags | Converted to 1-line clean title, 1-line subtitle, clean status pill, removed verbose labels. |
| **Gate 2: Exam Runner** (`/applicant/entrance-examination`) | Over-decorated briefing card, wordy rules lists | Streamlined briefing specs into high-density grid, crisp tabular timer in session runner. |
| **Gate 3: Referral Slip** (`/applicant/referral-slip`) | Verbose directive banner, redundant copy tags | Clean Philippine bond paper form sheet with crisp control badges and single-click print CTA. |
| **Gate 4: Aptitude Results** (`/guidance/aptitude-results`) | Wordy header subtitle, repetitive metric tags in table rows | Clean 1-line header, pure PR/Stanine numbers, standardized recommendation pills. |
| **Gate 5: Legacy Migration** (`/guidance/legacy-migration`) | 4-tier badge row, verbose paragraph, cut-off dossier cards | **Gold Standard Reference**: Pure `%`, dual columns, non-clipping scrollable dossier modal. |
| **Gate 6: Faculty Class Roster** (`/faculty-roster`) | Stacked badges, schedule/PRC clutter, premature grading inputs | **Gold Standard Reference**: Pure 8-column section roll, 1-line header, clean printout modal. |
| **Workflow Gate Banner** (`App.jsx`) | "Gate X" repeated multiple times in button labels and tags | Sleek, compact numbered steps (`1: Exam Bank`, `2: Exam Runner`, etc.) with clean status indicators. |
