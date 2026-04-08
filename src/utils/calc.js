/**
 * Format a number as currency: $12.34
 */
export function fmtMoney(n) {
  return '$' + Math.max(0, n).toFixed(2);
}

/**
 * Format elapsed seconds as HH:MM:SS
 */
export function fmtDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * Format a Date to a human-readable time: 3:45 PM
 */
export function fmtTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Calculate total base pay from elapsed seconds and hourly wage.
 */
export function calcBasePay(elapsedSeconds, hourlyWage) {
  return (elapsedSeconds / 3600) * hourlyWage;
}

/**
 * Calculate effective hourly rate.
 * Returns null if no time has elapsed.
 */
export function calcEffectiveRate(totalEarnings, elapsedSeconds) {
  if (elapsedSeconds < 1) return null;
  return (totalEarnings / elapsedSeconds) * 3600;
}
