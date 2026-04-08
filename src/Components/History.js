import { useState } from 'react';
import { fmtMoney, fmtTime, calcBasePay } from '../utils/calc';
import ConfirmModal from './ConfirmModal';

export default function History({ deliveries, shift, settings, onDeleteLast, onReset, onRestoreReset, canRestoreReset }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const elapsedSeconds = shift.elapsedSeconds || 0;
  const basePay   = calcBasePay(elapsedSeconds, settings.hourlyWage);
  const totalTips = deliveries.reduce((s, d) => s + d.tip, 0);
  const totalComm = deliveries.reduce((s, d) => s + d.commission, 0);
  const grandTotal = basePay + totalTips + totalComm;

  return (
    <div className="page">
      {/* ── Grand total banner ── */}
      <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
        <div className="earnings-label">Grand Total</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 44, color: 'var(--text-money)', lineHeight: 1 }}>
          {fmtMoney(grandTotal)}
        </div>
      </div>

      {/* ── Breakdown ── */}
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

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {deliveries.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={onDeleteLast}>
            ↩ Undo Last Delivery
          </button>
        )}
        {canRestoreReset && (
          <button className="btn btn-outline btn-sm" onClick={onRestoreReset}>
            🔄 Restore Last Reset
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => setShowResetConfirm(true)}>
          🗑 Reset All Totals
        </button>
      </div>

      {/* ── Delivery history ── */}
      <div className="section-heading">Delivery History</div>
      {deliveries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛵</div>
          No deliveries logged yet
        </div>
      ) : (
        <div className="history-list">
          {[...deliveries].reverse().map((d, i) => (
            <div key={d.id} className="history-item">
              <div className="history-item-left">
                <div className="history-item-num">Delivery #{deliveries.length - i}</div>
                <div className="history-item-tip">
                  {d.tip > 0 ? `Tip: ${fmtMoney(d.tip)}` : 'No tip'}
                </div>
                <div className="history-item-comm">
                  +{fmtMoney(d.commission)} commission = {fmtMoney(d.tip + d.commission)}
                </div>
              </div>
              <div className="history-item-time">{fmtTime(d.timestamp)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Confirm reset modal ── */}
      {showResetConfirm && (
        <ConfirmModal
          title="Reset All Totals?"
          body="This will clear all deliveries and reset the shift timer. A snapshot will be saved so you can restore it."
          confirmLabel="Yes, Reset Everything"
          confirmClass="btn btn-danger"
          onConfirm={() => { onReset(); setShowResetConfirm(false); }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}
