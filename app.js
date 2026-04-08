import { useState } from &#39;react&#39;;
import { useStorage } from &#39;./hooks/useStorage&#39;;
import { useToast, ToastContainer } from &#39;./components/Toast&#39;;
import StarsBg from &#39;./components/StarsBg&#39;;
import Dashboard from &#39;./components/Dashboard&#39;;
import History from &#39;./components/History&#39;;
import Settings from &#39;./components/Settings&#39;;
import &#39;./index.css&#39;;
// ─── Default state shapes
────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
hourlyWage: 7.50,
commissionPerDelivery: 1.50,
};
const DEFAULT_SHIFT = {
active: false,
startTime: null,
elapsedSeconds: 0,
};
// ─── Tab icons (inline SVG as components)
───────────────────────────────────
function IconDash() {
return (
&lt;svg width=&quot;22&quot; height=&quot;22&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot;
strokeWidth=&quot;2.2&quot; strokeLinecap=&quot;round&quot; strokeLinejoin=&quot;round&quot;&gt;
&lt;circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;10&quot;/&gt;&lt;polyline points=&quot;12 6 12 12 16 14&quot;/&gt;
&lt;/svg&gt;
);
}
function IconHistory() {
return (
&lt;svg width=&quot;22&quot; height=&quot;22&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot;
strokeWidth=&quot;2.2&quot; strokeLinecap=&quot;round&quot; strokeLinejoin=&quot;round&quot;&gt;
&lt;path d=&quot;M3 3h7v7H3z&quot;/&gt;&lt;path d=&quot;M14 3h7v7h-7z&quot;/&gt;&lt;path d=&quot;M3 14h7v7H3z&quot;/&gt;&lt;path
d=&quot;M14 14h7v7h-7z&quot;/&gt;
&lt;/svg&gt;
);
}
function IconSettings() {

return (
&lt;svg width=&quot;22&quot; height=&quot;22&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot;
strokeWidth=&quot;2.2&quot; strokeLinecap=&quot;round&quot; strokeLinejoin=&quot;round&quot;&gt;
&lt;circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;3&quot;/&gt;
&lt;path d=&quot;M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0
0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0
0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-
1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-
2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0
1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65
1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z&quot;/&gt;
&lt;/svg&gt;
);
}
// ─── App
────────────────────────────────────────────────────────────
─────────
export default function App() {
const [tab, setTab] = useState(&#39;dashboard&#39;);
const { toasts, show: showToast } = useToast();
// Persisted state
const [settings, setSettings] = useStorage(&#39;vd_settings&#39;, DEFAULT_SETTINGS);
const [shift, setShift] = useStorage(&#39;vd_shift&#39;, DEFAULT_SHIFT);
const [deliveries, setDeliveries] = useStorage(&#39;vd_deliveries&#39;, []);
const [lastReset, setLastReset] = useStorage(&#39;vd_last_reset&#39;, null); // snapshot for undo
// ── Shift controls
──────────────────────────────────────────────────────────
function handleStartShift() {
setShift({ active: true, startTime: Date.now(), elapsedSeconds: 0 });
showToast(&#39;�� Shift started!&#39;);
}
function handleEndShift() {
// Capture elapsed seconds at end time so totals remain accurate
const elapsed = shift.startTime
? Math.floor((Date.now() - shift.startTime) / 1000)
: shift.elapsedSeconds;
setShift({ active: false, startTime: null, elapsedSeconds: elapsed });
showToast(&#39;Shift ended.&#39;);

}
// ── Delivery
────────────────────────────────────────────────────────────
────
function handleAddDelivery(tipAmount) {
const entry = {
id: Date.now(),
tip: Math.max(0, tipAmount),
commission: settings.commissionPerDelivery,
timestamp: Date.now(),
};
setDeliveries(prev =&gt; [...prev, entry]);
const total = entry.tip + entry.commission;
showToast(`+$${total.toFixed(2)} added ��`);
}
function handleDeleteLast() {
setDeliveries(prev =&gt; prev.slice(0, -1));
showToast(&#39;Last delivery removed.&#39;);
}
// ── Reset / Restore
──────────────────────────────────────────────────────────
function handleReset() {
// Save snapshot
setLastReset({ shift, deliveries, savedAt: Date.now() });
// Clear
setDeliveries([]);
setShift(DEFAULT_SHIFT);
showToast(&#39;Reset complete. Tap &quot;Restore&quot; to undo.&#39;);
}
function handleRestoreReset() {
if (!lastReset) return;
setDeliveries(lastReset.deliveries);
setShift(lastReset.shift);
setLastReset(null);
showToast(&#39;Last session restored!&#39;);
}

// ── Settings
────────────────────────────────────────────────────────────
─────
function handleSaveSettings(newSettings) {
setSettings(newSettings);
showToast(&#39;Settings saved ✓&#39;);
}
// ─── Render
────────────────────────────────────────────────────────────
─────
return (
&lt;&gt;
&lt;StarsBg /&gt;
&lt;div className=&quot;app-shell&quot;&gt;
{/* Header */}
&lt;header className=&quot;app-header&quot;&gt;
&lt;div&gt;
&lt;div className=&quot;app-title&quot;&gt;�� Vocelli Driver&lt;/div&gt;
&lt;div className=&quot;app-subtitle&quot;&gt;Earnings Tracker&lt;/div&gt;
&lt;/div&gt;
&lt;div style={{ textAlign: &#39;right&#39; }}&gt;
&lt;div style={{ fontFamily: &#39;var(--font-mono)&#39;, fontSize: 13, color: &#39;var(--green-bright)&#39; }}&gt;
${settings.hourlyWage.toFixed(2)}/hr
&lt;/div&gt;
&lt;div style={{ fontSize: 11, color: &#39;var(--text-dim)&#39; }}&gt;
+${settings.commissionPerDelivery.toFixed(2)}/delivery
&lt;/div&gt;
&lt;/div&gt;
&lt;/header&gt;
{/* Tab content */}
{tab === &#39;dashboard&#39; &amp;&amp; (
&lt;Dashboard
shift={shift}
deliveries={deliveries}
settings={settings}
onStartShift={handleStartShift}
onEndShift={handleEndShift}
onAddDelivery={handleAddDelivery}
/&gt;
)}

{tab === &#39;history&#39; &amp;&amp; (
&lt;History
deliveries={deliveries}
shift={shift}
settings={settings}
onDeleteLast={handleDeleteLast}
onReset={handleReset}
onRestoreReset={handleRestoreReset}
canRestoreReset={!!lastReset}
/&gt;
)}
{tab === &#39;settings&#39; &amp;&amp; (
&lt;Settings
settings={settings}
onSave={handleSaveSettings}
/&gt;
)}
{/* Tab bar */}
&lt;nav className=&quot;tab-bar&quot;&gt;
&lt;button className={`tab-btn${tab === &#39;dashboard&#39; ? &#39; active&#39; : &#39;&#39;}`} onClick={() =&gt;
setTab(&#39;dashboard&#39;)}&gt;
&lt;IconDash /&gt;
Dashboard
&lt;/button&gt;
&lt;button className={`tab-btn${tab === &#39;history&#39; ? &#39; active&#39; : &#39;&#39;}`} onClick={() =&gt;
setTab(&#39;history&#39;)}&gt;
&lt;IconHistory /&gt;
History
&lt;/button&gt;
&lt;button className={`tab-btn${tab === &#39;settings&#39; ? &#39; active&#39; : &#39;&#39;}`} onClick={() =&gt;
setTab(&#39;settings&#39;)}&gt;
&lt;IconSettings /&gt;
Settings
&lt;/button&gt;
&lt;/nav&gt;
&lt;/div&gt;
{/* Toasts */}
&lt;ToastContainer toasts={toasts} /&gt;
&lt;/&gt;
);
}