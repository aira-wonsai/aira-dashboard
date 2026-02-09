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

# Run visual regression tests
npm run test:visual
```

### Development Server
```bash
# Serve the public directory
npx serve public -p 8080
```

## Deployment

This project is deployed to Vercel: https://aira-dashboard.vercel.app

**Automatic deployments**: Push to `main` branch triggers Vercel deployment via GitHub Actions

### Manual Deployment
```bash
# Deploy using Vercel CLI
# Set environment variables (stored in .env)
export VERCEL_TOKEN=your_vercel_token_here
export GITHUB_TOKEN=your_github_token_here

# Deploy
npx vercel --token $VERCEL_TOKEN
```

## Security

**Important**: Tokens are stored in `.env` file which is included in `.gitignore`. Never commit or push `.env` file.

### Environment Variables (not in git)
- `GITHUB_TOKEN`: GitHub Personal Access Token for repo operations
- `VERCEL_TOKEN`: Vercel deployment token

### How to Generate Tokens

**GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Note: "Aira Dashboard"
4. Select scopes: `repo` (full control of repositories)
5. Generate token

**Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Token description: "Aira Dashboard"
4. Scope: "Full Account"
5. Generate token

## Cron Jobs

- **Dashboard Data Sync**: Runs every 15 minutes
  - Parses memory files
  - Updates JSON data files
  - Commits and pushes to GitHub
  - Triggers Vercel auto-deploy

## License

MIT

## Built with ❤️ for Won

---

## Project Structure

```
aira-dashboard/
├── public/
│   ├── data/
│   │   ├── activities.json    # Parsed from memory files
│   │   ├── news.json          # From Telegram
│   │   ├── stocks.json        # From Telegram
│   │   ├── moltbook.json      # Daily summaries
│   │   └── schedule.json      # Cron job list
│   └── index.html           # Main dashboard
├── scripts/
│   ├── parse-memory.js    # Parser for memory .md files
│   └── sync-data.js       # Main data sync script
├── tests/
│   ├── unit.test.js       # Vitest unit tests
│   └── e2e.test.js        # Playwright E2E tests
├── .github/
│   └── workflows/
│       └── ci-cd.yml     # GitHub Actions pipeline
├── .env                 # Local environment (git-ignored)
├── vercel.json           # Vercel configuration
├── vitest.config.js     # Vitest configuration
├── playwright.config.js  # Playwright configuration
└── README.md             # This file
```

## Data Sync Flow

1. **Memory Parsing**: `parse-memory.js` reads `.md` files from `/memory/` directory
2. **Data Updates**: `sync-data.js` runs all parsers and updates JSON files
3. **Git Commit**: Changes are committed to GitHub
4. **Auto-Deploy**: GitHub Actions triggers Vercel deployment
5. **Live URL**: Dashboard is automatically updated at https://aira-dashboard.vercel.app
