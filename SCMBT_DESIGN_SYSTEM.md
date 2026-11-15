# SCMBT Institutional Portal & Form Design System

## 1. Architectural Overview & Layout Grid
The portal uses an asymmetrical **3-Column Canvas System** set on a soft cool-grey backdrop (`#f1f5f9` to `#eef2f6`):

1. **Left Navigation Rail (Sidebar)**
   - **Width**: `240px` (expanded) / `76px` (capsule collapsed).
   - **Background**: Solid white (`#ffffff`) with clean right border or floating container separation (`border-right: 1px solid #e2e8f0`).
   - **Top Emblem**: Centered SCMBT Maritime Crest Logo (`SCMBT_Crest.png`). Clicking the logo or crest acts as the collapse/expand trigger.
   - **Menu Items**:
     - Strict 1-word labels: `Dashboard`, `Tasks`, `Campus`, `Profile`, `Academics`, `Finance`, `Analytics`, `Settings`.
     - Counter badges: Amber pill (`bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold`).
     - Active Item: Dark Navy fill (`#042B4E`), crisp white text and icon, with a subtle 2px amber accent indicator bar (`#f59e0b` / `box-shadow: 0 2px 0 0 #F98809`) along the bottom edge.
     - Inactive Items: Slate-600 (`#475569`) with subtle hover highlight (`bg-slate-50 text-slate-900`).
   - **Bottom Utility Items**:
     - `Support` (Help circle icon).
     - `Settings` (Cog icon).
     - `Signout` (Log out door icon, styled in distinct muted red `#dc2626` / `#ef4444`).

2. **Top Navigation & Page Title Bar**
   - Height: `60px` - `68px`, borderless (`border-bottom: none`), clean optical spacing.
   - **Left utilities**: Magnifying search icon in warm amber (`#f59e0b`).
   - **Center Capsule**: Dark Navy pill container (`#042B4E`) with white text (e.g., `Student Profile`). Acts as the unified page container header without cluttering the form canvas.
   - **Center utilities**: Globe/language icon in amber (`#f59e0b`).
   - **Right Actions**:
     - Notification bell icon in amber (`#f59e0b`).
     - User Identity capsule: White pill with thin border (`#e2e8f0`), dark navy circle user avatar icon, and student name text (`Student Name`).

3. **Center Column: Document Form Sheet**
   - **Presentation**: Bounded floating white card (`bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8`).
   - Never spans the entire monitor; maximum ergonomic reading and data-entry width (`max-w-4xl` / `800px - 860px`).
   - **Form Section Header**:
     - Rounded horizontal pill or box banner (`bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-lg`).
     - Left accent bar: `3px` solid black/dark navy (`#0f172a`) on the left edge.
     - Title typography: Semibold dark slate (`#0f172a`, `text-sm font-semibold tracking-wide`), e.g. `Personal Information (Full Name)`.

4. **Right Rail: Progress Gauge & Document Section Checklist**
   - **Width**: `280px` - `310px`.
   - **Circular Completion Card**:
     - Clean white card (`rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col items-center justify-center`).
     - SVG circular progress ring: Amber stroke (`#f59e0b` or `#F98809`), background track `#f1f5f9`.
     - Center value: Bold percentage (`80%`) and fraction subtitle (`4 of 5 done`).
     - Card footer: Clock icon + timestamp (`Saved: Just now`, text-xs text-slate-400).
   - **Document Sections Checklist**:
     - Header: Small uppercase tracking label: `DOCUMENT SECTIONS` (`text-xs font-semibold text-slate-500 uppercase tracking-wider`).
     - List Items (numbered 1 to 5):
       - **Active Item**: Dark Navy (`#042B4E`), no black borders (`border: none`), crisp white title (`1. Personal Information`), translucent white subtitle (`Full Name, Birth, Address`), and amber circular checkmark badge.
       - **Completed Inactive Items**: White background, `border: 1px solid #e2e8f0`, dark slate title, muted grey subtitle, amber circular checkmark.
       - **Pending Inactive Items**: White background, `border: 1px solid #e2e8f0`, grey title, grey circle outline (unchecked).
   - **Bottom Action**:
     - `Print / Export PDF` pill button: Outlined white pill with printer icon, grey border, hover shadow.

---

## 2. Personal Information Form Grid Specification

### Row 1: Surname + First Name (50 / 50 split)
```html
<div class="grid grid-cols-2 gap-4">
  <div>
    <label class="text-xs font-medium text-slate-700">Surname *</label>
    <input type="text" value="Dela Cruz" class="input-base" />
  </div>
  <div>
    <label class="text-xs font-medium text-slate-700">First Name *</label>
    <input type="text" value="Juan" class="input-base" />
  </div>
</div>
```

### Row 2: Middle Name + Extension (~70 / 30 split)
```html
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-8">
    <label class="text-xs font-medium text-slate-700">Middle Name</label>
    <input type="text" value="Santos" class="input-base" />
  </div>
  <div class="col-span-4">
    <label class="text-xs font-medium text-slate-700">Extension</label>
    <select class="input-base">
      <option>N/A</option>
      <option>Jr.</option>
      <option>Sr.</option>
      <option>III</option>
    </select>
  </div>
</div>
```

### Row 3: Demographics & Birth (4 equal columns)
- Col 1: `Date of Birth *` (Date picker with calendar icon)
- Col 2: `Place of Birth (City) *`
- Col 3: `Sex` (Dropdown: Male / Female)
- Col 4: `Blood Type` (Dropdown: O+, A+, B+, etc.)

### Row 4: Contact & Identity (3 equal columns)
- Col 1: `Mobile Number *` (e.g. `0917-123-4567`)
- Col 2: `Email Address *` (Focused state has active ring: `ring-2 ring-blue-500/30 border-blue-600`)
- Col 3: `PhilSys / National ID No.` (e.g. `4920-1284-9102-3910`)

### Row 5: Residential Address Block
- Wrapped inside a dedicated nested container: `bg-slate-50/70 border border-slate-200/80 rounded-xl p-4`.
- Section Title: `Residential Address` (small semibold text).
- **Line 1 (3 equal columns)**:
  - House/Lot/Block (e.g. `Lot 14 Blk 2`)
  - Street (e.g. `Acacia St.`)
  - Barangay (e.g. `Brgy. Commonwealth`)
- **Line 2 (3 equal columns)**:
  - City/Municipality (e.g. `Quezon City`)
  - Province/State (e.g. `Metro Manila`)
  - Postal/ZIP Code (e.g. `1121`)
- **Checkbox below**:
  - `[x] Permanent Address is identical to Residential Address`

---

## 3. Color Tokens & Theme System

| Token Name | Hex Code | Purpose / Application |
|---|---|---|
| `navy-primary` | `#042B4E` | Top page capsule, active sidebar item, active document section card |
| `amber-accent` | `#F59E0B` / `#F98809` | Progress gauge stroke, checkmark badges, top utility icons, active tab underline |
| `danger-signout` | `#DC2626` | Signout nav action item |
| `canvas-bg` | `#F1F5F9` | Master page background outside floating containers |
| `surface-white` | `#FFFFFF` | Form card, sidebar, checklist cards, progress gauge card |
| `sub-surface` | `#F8FAFC` | Section header banners, residential address sub-container |
| `border-subtle` | `#E2E8F0` | Form field borders, card borders, dividers |
| `text-primary` | `#0F172A` | Field values, section headings, card titles |
| `text-secondary` | `#475569` | Field labels, navigation labels, inactive document section subtitles |
| `text-muted` | `#94A3B8` | Timestamps, placeholder text, inactive outline icons |

---

## 4. Input Field Design Rules
1. **Height**: Compact `38px` - `42px` height to prevent sprawling forms.
2. **Padding**: `px-3.5 py-2` with `text-sm font-normal text-slate-900`.
3. **Corner Radius**: `rounded-lg` (`8px`).
4. **Border & Shadows**: Crisp `1px solid #d1d5db` or `#e2e8f0` with subtle inner focus glow (`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none`).
5. **Labels**: Placed directly above the input, `text-xs font-medium text-slate-700 mb-1`, required fields marked with an asterisk (`*`).

---

## 5. Interaction & Behavioral Rules
- **Sidebar Collapse**:
  - Clicking the logo or crest toggles between full 240px wide sidebar and 76px compact capsule sidebar.
  - No redundant chevrons or toggle buttons.
- **Top Page Indicator**:
  - Always reflects the current page container in the center navy pill (`#042B4E`).
- **No Harsh Lines**:
  - Top header has no horizontal bottom divider.
  - Center workspace flows directly into the right rail without a vertical line divider. Separation is achieved through white card elevation on the cool-grey canvas.
