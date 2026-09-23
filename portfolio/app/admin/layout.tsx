'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⬛' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },
  { href: '/admin/projects', label: 'Projects', icon: '📁' },
  { href: '/admin/skills', label: 'Skills', icon: '⚙️' },
  { href: '/admin/experience', label: 'Experience', icon: '💼' },
  { href: '/admin/certifications', label: 'Certifications', icon: '🏅' },
  { href: '/admin/education', label: 'Education', icon: '🎓' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--muted)' }}>Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="brand" style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <span className="brand-mark">M</span>
          <span>Admin</span>
        </div>
        <ul className="admin-nav">
          {NAV.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname === href ? 'active' : ''}
              >
                <span>{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', padding: '0 16px 16px' }}>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', fontSize: '.85rem' }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
