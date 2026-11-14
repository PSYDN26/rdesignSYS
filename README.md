# ClassIn UI Design System & Boilerplate Template

A pixel-perfect, responsive React + Vite boilerplate template replicating the desktop and mobile views of the ClassIn educational platform. Built with React, Vite, and modern CSS design tokens.

---

## 📱 Features & Highlights

- **Dual-View Design Architecture**:
  - **Desktop Window View (`image.png`)**:
    - Floating capsule top bar with search, `1 lesson` live indicator, discovery compass, and OS-style window controls (`_`, `□`, `✕`).
    - Collapsible left sidebar navigation (`Home`, `Chat`, `To Do` with red badge count, `Calendar`, `Drive`, `Blackboard`, `Mirroring`).
    - User account footer with online indicator dot and subscription status (`Free`).
    - Main action area with filter dropdown (`All ˅`), `+ New Class` pill button, and the dashed empty-state card ("Create a class - Invite members to teach & learn together").
    - Right sidebar to-do list with timeline divider ("Next 24 hours"), interactive lesson card (`111426 1400 Lucy`), and live `Enter` button.
  - **Mobile View (`image_2.png`)**:
    - Realistic smartphone status bar (carrier, battery 73%, 5G, 2:09 clock).
    - Top app header with user avatar badge (`01`), `Home` title, `Free` badge, search icon, and quick-add icon.
    - Subheader with category selector and `+ New Class` pill.
    - Centered dashed create class card with circular `+` button.
    - 6-tab bottom navigation (`Home`, `Chat`, `To Do`, `Calendar`, `Drive`, `Growth`) with active state and notification badges.
    - Native home gesture bar indicator.
- **Interactive Boilerplate Switcher**:
  - Toggle between **Desktop Preview**, **Mobile Phone Frame Preview**, and **Fluid Responsive Mode** directly via the floating top switcher.
- **Fully Interactive**:
  - Click **`+ New Class`** or the dashed card to open the **Create Class Modal** and dynamically add classes to the grid.
  - Click the green **`Enter`** button to launch the **Live Classroom Simulator** (with microphone, camera, screen share, and raise hand controls).

---

## 🛠️ Tech Stack

- **Framework**: [React 18 / 19](https://react.dev/)
- **Bundler / Dev Server**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Styling**: Modular Vanilla CSS with comprehensive CSS custom property design tokens (`src/index.css`)

---

## 📂 Project Structure

```
rdesignSYS/
├── index.html                    # HTML entry with Plus Jakarta Sans & viewport setup
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # React DOM root entry
    ├── index.css                 # Global design tokens, desktop & mobile styles
    ├── App.jsx                   # Main orchestrator with state & view switching
    └── components/
        ├── TopBar.jsx            # Desktop window titlebar & center capsule
        ├── Sidebar.jsx           # Desktop left navigation & user profile
        ├── MainContent.jsx       # Subheader controls, dashed create card & class grid
        ├── TodoList.jsx          # Desktop right sidebar & lesson to-do card
        ├── MobileHeader.jsx      # Mobile status bar & top navigation
        ├── MobileBottomNav.jsx   # Mobile 6-tab bottom navigation
        ├── ViewSwitcher.jsx      # Floating preview mode selector
        ├── CreateClassModal.jsx  # Interactive class creation modal
        └── EnterClassModal.jsx   # Interactive live lesson simulator modal
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🎨 Customizing Design Tokens

All colors, border radiuses, and shadows can be customized in `src/index.css`:
```css
:root {
  --bg-app: #ffffff;
  --bg-page: #f2f3f5;
  --accent-green: #00c06d;
  --bg-pill: #000000;
  --radius-lg: 16px;
  /* ... */
}
```
