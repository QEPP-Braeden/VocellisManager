import { useState } from 'react';

export default function Settings({ settings, onSave }) {
  const [hourly, setHourly]   = useState(String(settings.hourlyWage));
  const [comm, setComm]       = useState(String(settings.commissionPerDelivery));
  const [saved, setSaved]     = useState(false);

  function handleSave() {
    const w = parseFloat(hourly);
    const c = parseFloat(comm);
    if (isNaN(w) || w <= 0 || isNaN(c) || c < 0) return;
    onSave({ hourlyWage: w, commissionPerDelivery: c });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="page">
      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Pay Settings
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            These values are saved locally and persist across sessions.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="setting-row">
            <label className="setting-label">Hourly Wage ($/hr)</label>
            <input
              className="setting-input"
              type="number"
              inputMode="decimal"
              value={hourly}
              onChange={e => setHourly(e.target.value)}
              min="0"
              step="0.25"
            />
          </div>

          <div className="setting-row">
            <label className="setting-label">Commission Per Delivery ($)</label>
            <input
              className="setting-input"
              type="number"
              inputMode="decimal"
              value={comm}
              onChange={e => setComm(e.target.value)}
              min="0"
              step="0.25"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={saved ? { background: 'linear-gradient(135deg,#1e5c30,#2a7d46)', boxShadow: 'none' } : {}}
          >
            {saved ? '✓ Saved!' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="card-sm">
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, color: 'var(--green-bright)', marginBottom: 6 }}>How earnings are calculated</div>
          <div>📍 <strong>Base Pay</strong> = Hourly wage × hours worked</div>
          <div>🛵 <strong>Per Delivery</strong> = Tip + commission</div>
          <div>💰 <strong>Total</strong> = Base pay + all tips + all commissions</div>
          <div>📈 <strong>Effective rate</strong> = Total ÷ hours worked</div>
        </div>
      </div>

      <div className="card-sm" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.6 }}>
          🌲 Vocelli Driver Tracker<br />
          All data stored locally on your device.<br />
          No account or internet required.
        </div>
      </div>
    </div>
  );
}
