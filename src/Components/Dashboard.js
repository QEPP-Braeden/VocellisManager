import { useState, useEffect, useRef } from 'react';
import { fmtMoney, fmtDuration, fmtTime, calcBasePay, calcEffectiveRate } from '../utils/calc';

export default function Dashboard({ shift, deliveries, settings, onStartShift, onEndShift, onAddDelivery }) {
  const [now, setNow] = useState(Date.now());
  const [tip, setTip] = useState('');
  const [flash, setFlash] = useState(false);
  const inputRef = useRef(null);

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSeconds = shift.active && shift.startTime
    ? Math.floor((now - shift.startTime) / 1000)
    : shift.elapsedSeconds || 0;

  const basePay     = calcBasePay(elapsedSeconds, settings.hourlyWage);
  const totalTips   = deliveries.reduce((s, d) => s + d.tip, 0);
  const totalComm   = deliveries.reduce((s, d) => s + d.commission, 0);
  const totalEarned = basePay + totalTips + totalComm;
  const effectiveRate = calcEffectiveRate(totalEarned, elapsedSeconds);

  function handleAddDelivery() {
    const tipVal = parseFloat(tip) || 0;
    onAddDelivery(tipVal);
    setTip('');
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    if (navigator.vibrate) navigator.vibrate([30, 20, 60]);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAddDelivery();
  }

  return (
    <div className="page">
      {/* ── Main earnings card ── */}
      <div className={`earnings-display${flash ? ' delivery-added' : ''}`}>
        <div className="earnings-label">Total Earned This Shift</div>
        <div className="earnings-amount">{fmtMoney(totalEarned)}</div>
        <div className="earnings-rate">
          Effective rate:&nbsp;
          <span>{effectiveRate !== null ? fmtMoney(effectiveRate) + '/hr' : '—'}</span>
        </div>
      </div>

      {/* ── Shift timer ── */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <div className="shift-status">
          <div className={`status-dot${shift.active ? ' active' : ''}`} />
          <span className="status-label">{shift.active ? 'Shift Active' : 'No Active Shift'}</span>
          {shift.active && shift.startTime && (
            <span className="badge" style={{ marginLeft: 'auto' }}>
              Since {fmtTime(shift.startTime)}
            </span>
          )}
        </div>

        <div className="shift-timer">{fmtDuration(elapsedSeconds)}</div>

        <div className="mt-2">
          {!shift.active ? (
            <button className="btn btn-primary" onClick={onStartShift}>
              🌲 Start Shift
            </button>
          ) : (
            <button className="btn btn-stop" onClick={onEndShift}>
              ⛔ End Shift
            </button>
          )}
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="stats-row">
        <div className="stat-block">
          <div className="stat-value text-money">{fmtMoney(basePay)}</div>
          <div className="stat-label">Hourly Pay</div>
        </div>
        <div className="stat-block">
          <div className="stat-value text-money">{fmtMoney(totalTips)}</div>
          <div className="stat-label">Tips</div>
        </div>
        <div className="stat-block">
          <div className="stat-value text-money">{fmtMoney(totalComm)}</div>
          <div className="stat-label">Commissions</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">{deliveries.length}</div>
          <div className="stat-label">Deliveries</div>
        </div>
      </div>

      {/* ── Add delivery ── */}
      <div className="card">
        <div className="tip-label">💵 Tip Amount</div>
        <input
          ref={inputRef}
          className="delivery-tip-input"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={tip}
          onChange={e => setTip(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!shift.active}
          min="0"
          step="0.01"
        />
        <div className="mt-2">
          <button
            className="btn btn-primary"
            onClick={handleAddDelivery}
            disabled={!shift.active}
          >
            🛵 Add Delivery (+{fmtMoney(settings.commissionPerDelivery)} commission)
          </button>
        </div>
        {!shift.active && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
            Start a shift to log deliveries
          </div>
        )}
      </div>
    </div>
  );
}
