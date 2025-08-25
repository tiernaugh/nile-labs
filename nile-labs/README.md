# Create T3 App


# Nile Labs Site

This is the Next.js application for the Nile Labs platform.

## Project Structure

This folder (`nile-labs`) will be the root for deployment to Vercel, while keeping documentation easily referenceable in the parent directory.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Query (TanStack Query)
- **Authentication:** Clerk (Phase 2)
- **Database:** Prisma + Vercel Postgres (Phase 2)
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm

## Development Phases

### Phase 1: Frontend Prototype (Current)
- Pure frontend with mock data
- No backend or database
- Focus on UX validation

### Phase 2: Backend Integration
- Wire up Clerk auth
- Connect to Vercel Postgres
- Replace mock data with API

### Phase 3: Polish & Launch
- Final touches
- Pre-populate content
- Deploy for team trip (September)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run Biome checks
pnpm check

# Format code
pnpm format
```

## Documentation

See parent directory for:
- `/03 Documentation/platform-core/` - PRDs and ADRs
- `/02 Areas/` - Context and planning documents
- `/CLAUDE.md` - Main project guide

## Deployment

This folder will be connected to Vercel for deployment.

```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```


Here's some info from t3 []
This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
]