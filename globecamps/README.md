# GlobeCamps

A modern platform to publish and manage global educational camps led by professors, industry leaders, and English teachers.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite (dev)

## Getting Started
1. Install dependencies:
   - `npm install`
2. Initialize the database:
   - `npm run prisma:migrate`
   - `npm run db:seed`
3. Start the dev server:
   - `npm run dev`

Open http://localhost:3000 in your browser.

## Project Structure
- `src/app` – App Router pages and API routes
- `src/components` – UI components
- `src/lib/prisma.ts` – Prisma client
- `prisma/schema.prisma` – Database schema
- `prisma/seed.js` – Seed data