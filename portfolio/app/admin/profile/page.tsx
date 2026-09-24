'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat { label: string; value: number; suffix: string; }
interface ProfileData {
  name: string; title: string; tagline: string; bio: string;
  available: boolean; stats: Stat[];
  email: string; phone: string; linkedin: string; github: string;
  cvUrl: string; avatarUrl: string;
}

const DEFAULT: ProfileData = {
  name: '', title: '', tagline: '', bio: '', available: true,
  stats: [
    { label: 'systems built', value: 3, suffix: '' },
    { label: 'certifications', value: 3, suffix: '' },
    { label: 'tools & languages', value: 10, suffix: '+' },
  ],
  email: '', phone: '', linkedin: '', github: '', cvUrl: '', avatarUrl: '',
};

async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message ?? 'Upload failed');
  }
  const data = await res.json();
  return data.url as string;
}

export default function AdminProfile() {
  const [form, setForm] = useState<ProfileData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setMsg('');
    try {
      const url = await uploadFile(file, 'portfolio/avatars');
      set('avatarUrl', url);
      setMsg('✓ Avatar uploaded successfully!');
    } catch (err: any) {
      setMsg(`✗ Avatar upload failed: ${err.message}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    setMsg('');
    try {
      const url = await uploadFile(file, 'portfolio/cv');
      set('cvUrl', url);
      setMsg('✓ CV uploaded to Cloudinary!');
    } catch (err: any) {
      setMsg(`✗ CV upload failed: ${err.message}`);
    } finally {
      setCvUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg(res.ok ? '✓ Profile saved successfully!' : '✗ Failed to save profile.');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--panel)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '8px 12px', color: 'var(--fg)', fontSize: '.9rem', outline: 'none',
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">

        {/* Avatar Upload */}
        <div className="admin-card">
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Profile Picture</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="Avatar preview"
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
              />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--panel)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '.75rem' }}>
                No image
              </div>
            )}
            <div>
              <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '.85rem' }}
                disabled={avatarUploading}
                onClick={() => avatarRef.current?.click()}
              >
                {avatarUploading ? 'Uploading…' : '📷 Upload Image'}
              </button>
              <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: 6 }}>
                Uploaded directly to Cloudinary. Max 10 MB.
              </p>
              {form.avatarUrl && (
                <p style={{ fontSize: '.75rem', wordBreak: 'break-all', color: 'var(--muted)', marginTop: 4 }}>
                  {form.avatarUrl}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
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

        {/* Stats */}
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

        {/* Contact & Links */}
        <div className="admin-card">
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem' }}>Contact & Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div><label>Email</label><input value={form.email} onChange={e => set('email', e.target.value)} type="email" /></div>
            <div><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div><label>LinkedIn URL</label><input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} /></div>
            <div><label>GitHub URL</label><input value={form.github} onChange={e => set('github', e.target.value)} /></div>
          </div>

          {/* CV Upload */}
          <div style={{ marginTop: 12 }}>
            <label>CV / Resume</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} style={{ display: 'none' }} />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '.85rem' }}
                disabled={cvUploading}
                onClick={() => cvRef.current?.click()}
              >
                {cvUploading ? 'Uploading…' : '📄 Upload CV / Resume'}
              </button>
              {form.cvUrl && (
                <a href={form.cvUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '.82rem', color: 'var(--purple)' }}>
                  View current CV ↗
                </a>
              )}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: 6 }}>
              Uploaded to Cloudinary — persists across deploys. Or paste a URL below.
            </p>
            <input
              value={form.cvUrl}
              onChange={e => set('cvUrl', e.target.value)}
              placeholder="https://res.cloudinary.com/... (auto-filled on upload)"
              style={{ marginTop: 6 }}
            />
          </div>
        </div>

        {msg && <p style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171', marginBottom: 12 }}>{msg}</p>}
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={saving || avatarUploading || cvUploading}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
