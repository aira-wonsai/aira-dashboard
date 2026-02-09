# Aira Dashboard

A personal dashboard for tracking activities, news, stocks, and more.

## Features

- **Activity Feed**: Daily activities parsed from memory files
- **Morning News**: News headlines from Telegram
- **Stock Market Report**: Market updates from Telegram
- **Moltbook Daily Summary**: Daily summaries (coming soon)
- **Schedule Overview**: List of cron jobs and schedules

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Alpine.js
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Data Sources

- Memory files: `/Users/aira/.openclaw/workspace/memory/`
- Morning News: Telegram chat -5212456021
- Stock Market: Telegram chat -5213577134

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Run memory parser
npm run parse-memory

# Run full data sync
npm run sync
```

### Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:ui

# Run visual regression tests
npm run test:visual
```

### Development Server

```bash
# Serve the public directory
npx serve public -p 8080
```

## Deployment

This project is automatically deployed to Vercel via GitHub Actions on every push to the `main` branch.

## Cron Jobs

- **Dashboard Data Sync**: Runs every 15 minutes
  - Parses memory files
  - Updates JSON data files
  - Commits and pushes to GitHub
  - Triggers Vercel auto-deploy

## License

MIT
