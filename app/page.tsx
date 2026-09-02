import { Topbar } from '@/components/Topbar';
import { Stage } from '@/components/Stage';
import { ContactSection } from '@/components/ContactSection';
import { SiteFooter } from '@/components/SiteFooter';

/**
 * Home page — the full Corvus scroll-driven landing experience.
 *
 * Composition root: all page-level sections are assembled here.
 * No business logic — just layout orchestration.
 */
export default function HomePage() {
  return (
    <>
      <Topbar />
      <main>
        <Stage />
        <ContactSection />
        <SiteFooter />
      </main>
    </>
  );
}