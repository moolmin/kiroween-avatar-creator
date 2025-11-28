# Halloween Ghost Avatar Maker

A Next.js 14 application for creating customized ghost avatars for Halloween.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **html2canvas** - SVG to PNG conversion
- **@headlessui/react** - Accessible UI components
- **Vitest** - Fast unit testing framework
- **fast-check** - Property-based testing library

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components (to be created)
├── lib/                   # Utilities and shared logic (to be created)
├── public/                # Static assets
└── vitest.config.ts       # Test configuration
```

## Development Notes

- TypeScript is configured with strict mode enabled
- Path aliases use `@/*` for imports from the root directory
- Tailwind CSS v3 is configured for styling
- Vitest is set up for unit and property-based testing
