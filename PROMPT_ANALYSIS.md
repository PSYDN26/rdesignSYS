# SCMBT Design Heuristics & Prompt Analysis: Header Unslopping

> **Prompt Reference**: User Directive regarding Gate 5 (Legacy Exam Migration) & Gate 6 (Faculty Class Roster)  
> **Source Log**: Conversation Turn 9–10  
> **Date**: November 18, 2026  
> **Status**: Codified & Integrated into Design System  

---

## 1. Verbatim Prompt Stored

```text
class roster sheet and legacy exam migration got it right table parts 

except for part like

SCMBT Guidance Directorate
Gate 5 Migration
Version Control • Dual Exam Columns
Student Entrance Exam & Aptitude Migration
Historical student testing roster. Click Details on any student to view full category breakdowns, RPM psychological evaluation, or adjust admission status.

SCMBT College of Maritime Education
Gate 6 • Faculty Class Roster
Official Section Roll
NAV 101: Terrestrial Navigation 1
Section BSMT 1-Alpha • 4.0 Units (3 Lec / 1 Lab) • MWF 08:00 - 09:30 AM | Simulator Hall B

Assigned Faculty: Capt. Eduardo Morales, MM
(PRC Lic. #0045812)
1st Semester, AY 2024–2025


too much details and text in the head sections
```

---

## 2. In-Depth Analysis of User Feedback

### A. The Core Critique
The user's feedback points directly to **Header Over-Engineering** (a textbook symptom of AI-generated design slop). 

While the table implementations were praised as having **"got it right"** (clean, numeric, uncluttered, action-driven), the top header cards suffered from **excessive contextualization**:
1. **Gratuitous Hierarchy Stacking**: Stacking 4–5 tiers of institutional identity (`Directorate` → `Gate Number` → `Feature Badge` → `Page Title` → `Explanatory Paragraph`).
2. **Filler Pills & Badges**: Excessive pill badges (`Version Control • Dual Exam Columns`, `Official Section Roll`, `Gate 6 • Faculty Class Roster`) that add zero utility to a user already on the page.
3. **Patronizing Helper Text**: Writing sentences like *"Click Details on any student to view full category breakdowns..."* which state the obvious and clutter viewport real estate.
4. **Metadata Inflation**: Displaying academic unit splits, room names, PRC license numbers, and semester labels directly in the page header rather than inside the course syllabus or modal printouts.

### B. Why the Table Parts "Got It Right"
The user explicitly confirmed the table parts succeeded because they adhered to **functional minimalism**:
- **Pure Numeric Values**: Only the percentage score (`81.9%`) is shown in the cell—no redundant labels or micro-graphs.
- **Action Buttons as Gateways**: Using compact `+ Input` and `[Details]` buttons that open complete dossiers rather than jamming inline edit fields or multi-column expansions into the main table.
- **Strict Role Boundaries**: Removing irrelevant grading columns (`Prelim`, `Midterm`, `Final`, `Computed`, `Remarks`) from the faculty roster sheet, keeping it strictly focused on **section enrollment and baseline assessment**.
- **Standardized Status Triad**: Pure `Pending`, `Approved`, `Rejected` indicators without unnecessary descriptive text.

---

## 3. Codified Rules for Institutional Headers (The "1 Title + 1 Subline" Rule)

To prevent regression across current and future gates (Admissions, Registrar, Grading, Portal), the following rules are strictly enforced:

| Dimension | ❌ AI Slop (Avoid) | ✅ SCMBT Standard (Enforced) |
| :--- | :--- | :--- |
| **Header Badges** | Stacks of 3–4 pills (`Gate X`, `Department`, `Version`) | **Zero badges** unless displaying a dynamic real-time status |
| **Page Title** | Multi-tiered headings with acronym explanations | **Single concise H1** (e.g., `NAV 101: Terrestrial Navigation 1`) |
| **Subtitle / Subline** | Multi-sentence paragraphs explaining UI mechanics | **Single metadata line** (e.g., `Section BSMT 1-Alpha • Capt. Eduardo Morales, MM`) |
| **Metadata Details** | PRC license numbers, schedule times, room halls in header | Moved to **Print Modal** or **Course Syllabus drawer** |
| **Header Actions** | Crowded button groups with mixed secondary actions | **Max 1–2 primary action buttons** aligned right (`[Print Roster]`, `[Upload CSV]`) |
| **Vertical Height** | Header card exceeding 140px vertical space | **Compact card under 80px**, preserving screen fold for the table |

---

## 4. Architectural Implementation Summary

### Gate 5: Guidance Legacy Migration
- **Title**: `Student Entrance Exam & Aptitude Migration`
- **Subtitle**: `Historical student testing and examination database`
- **Actions**: `[Download Template]` and `[Upload CSV Records]`
- **Table**: 2 dedicated columns for `Entrance Exam` and `Aptitude Test` displaying pure `%` or `+ Input` button.

### Gate 6: Faculty Class Roster
- **Title**: `NAV 101: Terrestrial Navigation 1`
- **Subtitle**: `Section BSMT 1-Alpha • Capt. Eduardo Morales, MM`
- **Actions**: `[Print Roster]`
- **Table**: 8-column official section roll (Index, ID, Name, Section, Entrance %, Aptitude %, Status, View Dossier). All grading and mentoring inputs removed.

---

## 5. Checklist for Future Pages
When designing any subsequent SCMBT view:
- [ ] Is there only **one H1**?
- [ ] Is the subtitle limited to **one crisp line** (no multi-sentence explanations)?
- [ ] Have all decorative pill badges been removed?
- [ ] Does the table show **raw metrics (%)** rather than crowded labels?
- [ ] Are modals explicitly scrollable without cut-off cards?
- [ ] Does the table preserve viewport fold without header bloat?
