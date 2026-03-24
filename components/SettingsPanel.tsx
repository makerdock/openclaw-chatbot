'use client';

import { useState, CSSProperties } from 'react';

type Props = {
  gatewayUrl: string; setGatewayUrl: (v: string) => void;
  token: string; setToken: (v: string) => void;
  agentId: string; setAgentId: (v: string) => void;
  onClose: () => void;
};

const s: Record<string, CSSProperties> = {
  panel: { width: 300, borderLeft: '1px solid #1f2937', background: '#111827', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1f2937' },
  title: { fontWeight: 600, fontSize: 14, color: '#fff' },
  closeBtn: { background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer', lineHeight: 1 },
  body: { flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 500, color: '#9ca3af' },
  input: {
    width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8,
    padding: '8px 12px', fontSize: 14, color: '#f9fafb', outline: 'none', fontFamily: 'inherit',
  },
  hint: { fontSize: 12, color: '#6b7280', lineHeight: 1.4 },
  code: { color: '#9ca3af', fontFamily: 'monospace', fontSize: 11 },
  quickstart: { background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: 12 },
  qTitle: { fontSize: 12, fontWeight: 500, color: '#9ca3af', marginBottom: 8 },
  qList: { fontSize: 12, color: '#6b7280', lineHeight: 1.8, paddingLeft: 16 },
  qCode: { color: '#fb923c', fontFamily: 'monospace', fontSize: 11 },
  footer: { padding: 12, borderTop: '1px solid #1f2937' },
  saveBtn: {
    width: '100%', padding: '8px', borderRadius: 8, background: '#f97316',
    border: 'none', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
  },
};

export default function SettingsPanel({ gatewayUrl, setGatewayUrl, token, setToken, agentId, setAgentId, onClose }: Props) {
  const [localUrl, setLocalUrl] = useState(gatewayUrl);
  const [localToken, setLocalToken] = useState(token);
  const [localAgentId, setLocalAgentId] = useState(agentId);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setGatewayUrl(localUrl);
    setToken(localToken);
    setAgentId(localAgentId);
    try {
      localStorage.setItem('openclaw_settings', JSON.stringify({ gatewayUrl: localUrl, token: localToken, agentId: localAgentId }));
    } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={s.panel}>
      <div style={s.header}>
        <span style={s.title}>Settings</span>
        <button style={s.closeBtn} onClick={onClose}>×</button>
      </div>
      <div style={s.body}>
        <div style={s.field}>
          <label style={s.label}>Gateway URL</label>
          <input style={s.input} type="url" value={localUrl} onChange={(e) => setLocalUrl(e.target.value)} placeholder="http://localhost:18789" />
          <p style={s.hint}>Your OpenClaw gateway address (default port 18789)</p>
        </div>
        <div style={s.field}>
          <label style={s.label}>Auth Token</label>
          <input style={s.input} type="password" value={localToken} onChange={(e) => setLocalToken(e.target.value)} placeholder="your-gateway-token" />
          <p style={s.hint}>From <code style={s.code}>gateway.auth.token</code> in your config</p>
        </div>
        <div style={s.field}>
          <label style={s.label}>Agent ID <span style={{ color: '#4b5563', fontWeight: 400 }}>(optional)</span></label>
          <input style={s.input} type="text" value={localAgentId} onChange={(e) => setLocalAgentId(e.target.value)} placeholder="my-agent-id" />
          <p style={s.hint}>Target a specific agent via <code style={s.code}>openclaw:agentId</code></p>
        </div>
        <div style={s.quickstart}>
          <p style={s.qTitle}>Quick start</p>
          <ol style={s.qList}>
            <li>Install: <code style={s.qCode}>brew install openclaw</code></li>
            <li>Run: <code style={s.qCode}>openclaw gateway</code></li>
            <li>Enable HTTP API in config</li>
            <li>Paste URL + token above</li>
          </ol>
        </div>
      </div>
      <div style={s.footer}>
        <button style={s.saveBtn} onClick={save}>{saved ? '✓ Saved' : 'Save Settings'}</button>
      </div>
    </div>
  );
}
