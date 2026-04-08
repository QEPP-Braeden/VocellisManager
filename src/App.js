import { useState } from 'react';
import { useStorage } from './hooks/useStorage';
import { useToast, ToastContainer } from './components/Toast';
import StarsBg from './components/StarsBg';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import './index.css';

// ─── Default state shapes ────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  hourlyWage: 7.50,
  commissionPerDelivery: 1.50,
};

const DEFAULT_SHIFT = {
  active: false,
  startTime: null,
  elapsedSeconds: 0,
};

// ─── Tab icons (inline SVG as components) ───────────────────────────────────

function IconDash() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconHistory() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const { toasts, show: showToast } = useToast();

  // Persisted state
  const [settings, setSettings]     = useStorage('vd_settings',   DEFAULT_SETTINGS);
  const [shift, setShift]           = useStorage('vd_shift',      DEFAULT_SHIFT);
  const [deliveries, setDeliveries] = useStorage('vd_deliveries', []);
  const [lastReset, setLastReset]   = useStorage('vd_last_reset', null); // snapshot for undo

  // ── Shift controls ──────────────────────────────────────────────────────────

  function handleStartShift() {
    setShift({ active: true, startTime: Date.now(), elapsedSeconds: 0 });
    showToast('🌲 Shift started!');
  }

  function handleEndShift() {
    // Capture elapsed seconds at end time so totals remain accurate
    const elapsed = shift.startTime
      ? Math.floor((Date.now() - shift.startTime) / 1000)
      : shift.elapsedSeconds;
    setShift({ active: false, startTime: null, elapsedSeconds: elapsed });
    showToast('Shift ended.');
  }

  // ── Delivery ────────────────────────────────────────────────────────────────

  function handleAddDelivery(tipAmount) {
    const entry = {
      id:         Date.now(),
      tip:        Math.max(0, tipAmount),
      commission: settings.commissionPerDelivery,
      timestamp:  Date.now(),
    };
    setDeliveries(prev => [...prev, entry]);
    const total = entry.tip + entry.commission;
    showToast(`+$${total.toFixed(2)} added 🛵`);
  }

  function handleDeleteLast() {
    setDeliveries(prev => prev.slice(0, -1));
    showToast('Last delivery removed.');
  }

  // ── Reset / Restore ──────────────────────────────────────────────────────────

  function handleReset() {
    // Save snapshot
    setLastReset({ shift, deliveries, savedAt: Date.now() });
    // Clear
    setDeliveries([]);
    setShift(DEFAULT_SHIFT);
    showToast('Reset complete. Tap "Restore" to undo.');
  }

  function handleRestoreReset() {
    if (!lastReset) return;
    setDeliveries(lastReset.deliveries);
    setShift(lastReset.shift);
    setLastReset(null);
    showToast('Last session restored!');
  }

  // ── Settings ─────────────────────────────────────────────────────────────────

  function handleSaveSettings(newSettings) {
    setSettings(newSettings);
    showToast('Settings saved ✓');
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <StarsBg />
      <div className="app-shell">
        {/* Header */}
        <header className="app-header">
          <div>
            <div className="app-title">🍕 Vocelli Driver</div>
            <div className="app-subtitle">Earnings Tracker</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green-bright)' }}>
              ${settings.hourlyWage.toFixed(2)}/hr
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
              +${settings.commissionPerDelivery.toFixed(2)}/delivery
            </div>
          </div>
        </header>

        {/* Tab content */}
        {tab === 'dashboard' && (
          <Dashboard
            shift={shift}
            deliveries={deliveries}
            settings={settings}
            onStartShift={handleStartShift}
            onEndShift={handleEndShift}
            onAddDelivery={handleAddDelivery}
          />
        )}
        {tab === 'history' && (
          <History
            deliveries={deliveries}
            shift={shift}
            settings={settings}
            onDeleteLast={handleDeleteLast}
            onReset={handleReset}
            onRestoreReset={handleRestoreReset}
            canRestoreReset={!!lastReset}
          />
        )}
        {tab === 'settings' && (
          <Settings
            settings={settings}
            onSave={handleSaveSettings}
          />
        )}

        {/* Tab bar */}
        <nav className="tab-bar">
          <button className={`tab-btn${tab === 'dashboard' ? ' active' : ''}`} onClick={() => setTab('dashboard')}>
            <IconDash />
            Dashboard
          </button>
          <button className={`tab-btn${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
            <IconHistory />
            History
          </button>
          <button className={`tab-btn${tab === 'settings' ? ' active' : ''}`} onClick={() => setTab('settings')}>
            <IconSettings />
            Settings
          </button>
        </nav>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
