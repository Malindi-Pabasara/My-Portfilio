'use client';

import { useEffect, useState } from 'react';

interface Stat { label: string; value: number; suffix: string; }
interface ProfileData {
  name: string; title: string; tagline: string; bio: string;
  available: boolean; stats: Stat[];
  email: string; phone: string; linkedin: string; github: string; cvUrl: string;
}

const DEFAULT: ProfileData = {
  name: '', title: '', tagline: '', bio: '', available: true,
  stats: [
    { label: 'systems built', value: 3, suffix: '' },
    { label: 'certifications', value: 3, suffix: '' },
    { label: 'tools & languages', value: 10, suffix: '+' },
  ],
  email: '', phone: '', linkedin: '', github: '', cvUrl: '',
};

export default function AdminProfile() {
  const [form, setForm] = useState<ProfileData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then((d) => {
      if (d && d.name) setForm(d);
    });
  }, []);

  const set = (key: keyof ProfileData, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const setStat = (i: number, field: keyof Stat, val: string | number) => {
    const stats = [...form.stats];
    stats[i] = { ...stats[i], [field]: field === 'value' ? Number(val) : val };
    setForm(f => ({ ...f, stats }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setMsg(res.ok ? '✓ Profile saved successfully!' : '✗ Failed to save profile.');
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-card">
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Personal Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div><label>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label>Title / Role</label><input value={form.title} onChange={e => set('title', e.target.value)} /></div>
          </div>
          <label>Tagline (hero heading)</label>
          <input value={form.tagline} onChange={e => set('tagline', e.target.value)} />
          <label>Bio (hero subtext)</label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} style={{ width: 'auto', margin: 0 }} />
            Available for opportunities
          </label>
        </div>

        <div className="admin-card">
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Stats</h2>
          {form.stats.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 12px', alignItems: 'start' }}>
              <div><label>Label</label><input value={s.label} onChange={e => setStat(i, 'label', e.target.value)} /></div>
              <div><label>Value</label><input type="number" value={s.value} onChange={e => setStat(i, 'value', e.target.value)} style={{ width: 80 }} /></div>
              <div><label>Suffix</label><input value={s.suffix || ''} onChange={e => setStat(i, 'suffix', e.target.value)} style={{ width: 60 }} /></div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Contact & Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div><label>Email</label><input value={form.email} onChange={e => set('email', e.target.value)} type="email" /></div>
            <div><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div><label>LinkedIn URL</label><input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} /></div>
            <div><label>GitHub URL</label><input value={form.github} onChange={e => set('github', e.target.value)} /></div>
          </div>
          <label>CV / Resume URL</label>
          <input value={form.cvUrl} onChange={e => set('cvUrl', e.target.value)} placeholder="https://..." />
        </div>

        {msg && <p style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171', marginBottom: 12 }}>{msg}</p>}
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
