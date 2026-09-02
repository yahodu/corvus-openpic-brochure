/**
 * Placeholder SVG rendered as an HTML string for the Corvus brand mark.
 * Monochrome so it stays legible over dark or fog frames.
 * Replace by dropping a file at public/assets/corvus-logo.png.
 */
export const PLACEHOLDER_LOGO_SVG =
  '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" ' +
  'style="width:100%;height:100%;display:block" aria-hidden="true">' +
  '<path d="M6 8c0 8 4 12 10 12s10-4 10-12c-3 3-6 4-10 4S9 11 6 8Z" fill="currentColor" stroke="none"/>' +
  '<circle cx="12.5" cy="9.5" r="1.6" fill="#fff" stroke="none"/>' +
  '<path d="M16 20v6M12 26h8"/></svg>';

/** SVG data URL for use in img src */
export const PLACEHOLDER_LOGO_DATA_URL = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_LOGO_SVG)}`;