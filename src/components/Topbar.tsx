'use client';

import Image from 'next/image';
import { useScrollHide } from '@/hooks/useScrollHide';

/**
 * Fixed top bar with auto-hide on scroll down.
 * Contains brand logo and navigation links.
 *
 * Single Responsibility: brand + navigation chrome.
 * Scroll-hide behavior is delegated to the useScrollHide hook.
 */
export function Topbar() {
  const hidden = useScrollHide();

  return (
    <header
      className={`topbar${hidden ? ' topbar--hidden' : ''}`}
      data-od-id="topbar"
    >
      <a className="brand" href="#top" data-od-id="brand">
        <span className="brand-logo" data-od-id="brand-logo" aria-hidden="true">
          <Image
            src="/logo.svg"
            alt=""
            width={28}
            height={28}
            unoptimized
            priority
          />
        </span>
        Corvus
      </a>
      <nav aria-label="Primary">
        <a href="#contact" data-od-id="nav-contact">
          Contact Us
        </a>
      </nav>
    </header>
  );
}