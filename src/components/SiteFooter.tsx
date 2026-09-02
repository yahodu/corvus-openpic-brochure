'use client';

import Image from 'next/image';

/**
 * Site footer with brand mark and copyright.
 *
 * Single Responsibility: footer chrome only.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" data-od-id="site-footer">
      <div className="footer-inner">
        <a className="footer-brand" href="#top" data-od-id="footer-brand">
          <span className="brand-logo" aria-hidden="true">
            <Image
              src="/logo.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
            />
          </span>
          Corvus
        </a>
        <span className="footer-meta" data-od-id="footer-meta">
          © 2026 Corvus. All rights reserved.
        </span>
      </div>
    </footer>
  );
}