'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats { projects: number; skills: number; experience: number; certifications: number; education: number; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/experience').then(r => r.json()),
      fetch('/api/certifications').then(r => r.json()),
      fetch('/api/education').then(r => r.json()),
    ]).then(([projects, skills, experience, certifications, education]) => {
      setStats({
        projects: projects.length,
        skills: skills.length,
        experience: experience.length,
        certifications: certifications.length,
        education: education.length,
      });
    });
  }, []);

  const cards = [
    { label: 'Projects', count: stats?.projects, href: '/admin/projects', color: 'var(--blue)' },
    { label: 'Skill Categories', count: stats?.skills, href: '/admin/skills', color: 'var(--purple)' },
    { label: 'Experience', count: stats?.experience, href: '/admin/experience', color: '#4ade80' },
    { label: 'Certifications', count: stats?.certifications, href: '/admin/certifications', color: '#f59e0b' },
    { label: 'Education', count: stats?.education, href: '/admin/education', color: '#f87171' },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>Manage your portfolio content</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(({ label, count, href, color }) => (
          <Link href={href} key={label} style={{ textDecoration: 'none' }}>
            <div className="admin-card" style={{ cursor: 'pointer', transition: 'border-color .2s', borderColor: 'var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {count ?? '—'}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.88rem', marginTop: 4 }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="admin-card">
        <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Quick links</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a href="/" target="_blank" className="btn btn-ghost" style={{ fontSize: '.85rem' }}>View portfolio ↗</a>
          <Link href="/admin/profile" className="btn btn-primary" style={{ fontSize: '.85rem' }}>Edit profile</Link>
        </div>
      </div>
    </div>
  );
}
