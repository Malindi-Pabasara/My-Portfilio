import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';

export const dynamic = 'force-dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Education from '@/components/Education';
import ProjectFeedback from '@/components/ProjectFeedback';
import Footer from '@/components/Footer';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};
const BASE = getBaseUrl();

async function fetchJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Fetch failed for ${path}: ${res.status} ${res.statusText}`);
      return fallback;
    }
    return res.json();
  } catch (error) {
    console.error(`Fetch error for ${path}:`, error);
    return fallback;
  }
}

export default async function HomePage() {
  const [profile, experience, skills, projects, certifications, education] = await Promise.all([
    fetchJSON('/api/profile', {}),
    fetchJSON('/api/experience', []),
    fetchJSON('/api/skills', []),
    fetchJSON('/api/projects', []),
    fetchJSON('/api/certifications', []),
    fetchJSON('/api/education', []),
  ]);

  const p = profile as Record<string, unknown>;
  // Shape projects for the feedback selector
  const feedbackProjects = (projects as Array<{ _id: string; title: string }>).map(({ _id, title }) => ({ _id, title }));

  return (
    <>
      <ProgressBar />
      {/* Glow orbs */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      <Navbar />

      <Hero
        name={(p.name as string) || 'Malindi Pabasara'}
        tagline={(p.tagline as string) || 'Building full‑stack systems that work.'}
        bio={(p.bio as string) || 'IT professional and HNDIT candidate specialising in full-stack web and mobile development.'}
        available={(p.available as boolean) ?? true}
        stats={(p.stats as Array<{ label: string; value: number; suffix: string }>) || []}
        cvUrl={(p.cvUrl as string) || '#'}
        avatarUrl={(p.avatarUrl as string) || (p.profilePicture as string) || ''}
      />

      <div className="wrap"><div className="divider" /></div>
      <About />

      <div className="wrap"><div className="divider" /></div>
      <Experience items={experience as Parameters<typeof Experience>[0]['items']} />

      <div className="wrap"><div className="divider" /></div>
      <Skills items={skills as Parameters<typeof Skills>[0]['items']} />

      <div className="wrap"><div className="divider" /></div>
      <Projects />

      <div className="wrap"><div className="divider" /></div>
      <Certifications items={certifications as Parameters<typeof Certifications>[0]['items']} />

      <div className="wrap"><div className="divider" /></div>
      <Education items={education as Parameters<typeof Education>[0]['items']} />

      <div className="wrap"><div className="divider" /></div>
      <ProjectFeedback projects={feedbackProjects} />

      <Footer profile={p as Parameters<typeof Footer>[0]['profile']} />
    </>
  );
}
