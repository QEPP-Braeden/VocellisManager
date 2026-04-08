# 🍕 Vocelli Driver Tracker

A mobile-first earnings tracker for Vocelli's Pizza delivery drivers. Track hourly pay, tips, and delivery commissions in real-time with a calming forest/night-sky aesthetic.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v16+ installed
- npm (comes with Node)

### Install & Run

```bash
# 1. Navigate to this folder
cd vocelli-tracker

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

The app will open at **http://localhost:3000** in your browser.

For the best mobile experience, open it on your phone or use Chrome DevTools mobile simulation (F12 → Toggle Device Toolbar).

---

## 📱 How to Use

### Dashboard Tab
1. Tap **Start Shift** — timer begins automatically
2. After each delivery, enter the tip amount and tap **Add Delivery**
   - Delivery commission is added automatically
3. Watch your **Total Earned** and **Effective Hourly Rate** update live
4. Tap **End Shift** when done

### History Tab
- See a full breakdown: hourly pay, tips, commissions, grand total
- **Undo Last Delivery** — removes most recent entry
- **Reset All Totals** — clears everything (saves a snapshot first)
- **Restore Last Reset** — undo a reset (shown if available)

### Settings Tab
- Set your **hourly wage** (default: $7.50/hr)
- Set your **commission per delivery** (default: $1.50)
- Changes are saved instantly to localStorage

---

## 💾 Persistence

All data is stored in **localStorage** — no backend or internet connection required. Data persists across:
- Browser refreshes
- Closing and reopening the tab
- Device sleep/wake

Data stored:
- `vd_settings` — wage & commission settings
- `vd_shift` — current shift state & elapsed time
- `vd_deliveries` — delivery history with tips
- `vd_last_reset` — snapshot for reset undo

---

## 🧮 Earnings Math

```
Base Pay         = Hourly Wage × (Elapsed Time in hours)
Per Delivery     = Tip Amount + Commission Per Delivery
Total Earned     = Base Pay + Sum of all delivery earnings
Effective Rate   = Total Earned ÷ Hours Worked
```

**Example:**
- 45 min worked at $7.50/hr → $5.625 base pay
- 1 delivery, $7 tip + $1.50 commission → $8.50
- **Total: $14.125 → ~$18.83/hr effective rate**

---

## 🎨 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React 18 (hooks)    |
| Styling   | Pure CSS (custom)   |
| Storage   | localStorage        |
| Icons     | Inline SVG          |
| Fonts     | Nunito + DM Mono    |
| Backend   | None needed         |

---

## 🌲 Design

- **Dark mode only** — easy on the eyes at night
- **Forest/night sky palette** — deep greens, dark blues, subtle star animation
- **Large tap targets** — safe for quick use between deliveries
- **Monospace numbers** — clean, readable earnings at a glance
- **Haptic feedback** — vibrates on delivery add (if device supports it)

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `/build` folder. You can serve this as a static site with any web host (Netlify, Vercel, GitHub Pages, etc.) or open `index.html` locally.

---

## 🛠 Folder Structure

```
vocelli-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js      # Main tab: timer, add delivery, earnings
│   │   ├── History.js        # History tab: totals, delivery list, reset
│   │   ├── Settings.js       # Settings tab: wage & commission
│   │   ├── StarsBg.js        # Animated star canvas background
│   │   ├── Toast.js          # Toast notification system
│   │   └── ConfirmModal.js   # Confirmation bottom sheet
│   ├── hooks/
│   │   └── useStorage.js     # localStorage-backed useState hook
│   ├── utils/
│   │   └── calc.js           # Money & time formatting utilities
│   ├── App.js                # Root component, state management
│   ├── index.css             # Global styles & design system
│   └── index.js              # React entry point
├── package.json
└── README.md
```
