# Corvus — Facial Analysis Suite

**Scroll-driven landing page** for Corvus, a facial analysis suite offering 2D/3D facial landmarks, face detection, gender and age prediction, and state-of-the-art face recognition models.

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example file and fill in SMTP credentials (optional — the contact form works in dev mode without them):

```bash
cp .env.local.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP auth user | — |
| `SMTP_PASS` | SMTP auth password/App Password | — |
| `SMTP_FROM` | From address for outgoing mail | — |

### Development

```bash
pnpm dev        # Start dev server (default: http://localhost:3000)
pnpm typecheck  # Run TypeScript type checking
pnpm lint       # Run ESLint
```

### Build & Production

```bash
pnpm build      # Build for production
pnpm start      # Start production server
```

---

## License

© 2026 Corvus / openpic.in — All rights reserved.