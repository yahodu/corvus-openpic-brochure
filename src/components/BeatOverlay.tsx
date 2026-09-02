'use client';

import type { BeatCardDef, BeatDef } from '@/types';

interface BeatCardProps {
  card: BeatCardDef;
}

function BeatCard({ card }: BeatCardProps) {
  return (
    <div
      className="card"
      data-od-id={`card-${card.h.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <h3>{card.h}</h3>
      <p>{card.p}</p>
    </div>
  );
}

interface BeatOverlayProps {
  beat: BeatDef;
  visible: boolean;
}

/**
 * Renders a single beat overlay (animated text section) at the scroll window.
 * Handles rich-P rendering with cursive-glow, card grids, and the final CTA link.
 *
 * Single Responsibility: render one beat's content given its visibility flag.
 * Animation values (opacity, y) are injected by the parent Beats component.
 */
export function BeatOverlay({ beat: b }: BeatOverlayProps) {
  const content = b.cards2x2 ? (
    <div className="split">
      <div>
        <span className="eyebrow">{b.eyebrow}</span>
        <h2>{b.h}</h2>
        <p className="lead">{b.p as string}</p>
      </div>
      <div className="cards cols-2x2">
        {b.cards2x2.map((c) => (
          <BeatCard key={c.h} card={c} />
        ))}
      </div>
    </div>
  ) : (
    <>
      <span className="eyebrow">{b.eyebrow}</span>
      <h2>{b.h}</h2>
      {b.richP ? (
        <p className="lead">
          {(b.p as [string, string, string])[0]}
          <span className="billion-glow">
            {(b.p as [string, string, string])[1]}
          </span>
          {(b.p as [string, string, string])[2]}
        </p>
      ) : (
        <p className="lead">{b.p as string}</p>
      )}
      {b.cards && (
        <div className="cards">
          {b.cards.map((c) => (
            <BeatCard key={c.h} card={c} />
          ))}
        </div>
      )}
      {b.id === 'beat-model-5' && (
        <a
          className="cta-link"
          href="#contact"
          style={{ marginTop: '1.6rem', display: 'inline-block' }}
        >
          Contact us for access
        </a>
      )}
    </>
  );

  return content;
}