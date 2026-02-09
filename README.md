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
- **Backend**: Node.js data sync scripts
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
# Serve public directory
npx serve public -p 8080
```

## Deployment

This project is deployed to: **https://aira-dashboard.vercel.app**

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
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Note: "Aira Dashboard"
4. Select scopes: `repo` (full control of repositories)
5. Generate token

**Vercel Token:**
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Token description: "Aira Dashboard"
4. Scope: "Full Account"
5. Generate token

## Automatic Data Sync (Every 15 Minutes)

The dashboard automatically updates every 15 minutes via a cron job.

### How It Works

1. **Cron Job Runs**: Every 15 minutes
2. **Data Sync Script Executes**: `scripts/auto-sync.sh`
3. **Tasks Performed**:
   - Parses memory files for activities
   - Updates all JSON data files in `public/data/`
   - Commits changes to Git
   - Pushes to GitHub main branch
4. **Vercel Auto-Deploys**: GitHub Actions detects push and deploys to Vercel
5. **Dashboard Refreshes**: Vercel serves updated data automatically

### Setting Up the Cron Job

To enable automatic 15-minute updates, set up a cron job on your system:

```bash
# Add to crontab (runs every 15 minutes)
*/15 * * * * /Users/aira/.openclaw/workspace/aira-dashboard/scripts/auto-sync.sh >> /Users/aira/.openclaw/logs/aira-dashboard-cron.log 2>&1

# To view cron jobs
crontab -l

# To edit cron jobs
crontab -e
```

### Cron Job Output

The sync script creates detailed logs with timestamps:
- `🔄 Starting Aira Dashboard auto-sync...` - Script start
- `📊 Running data sync...` - Parsing memory files
- `✅ Changes detected, committing...` - Git commit with timestamp
- `📤 Pushing to GitHub (will trigger Vercel deploy)...` - Push to remote
- `✅ Successfully synced and deployed!` - Successful deployment
- `✅ No changes, already up to date` - No changes detected

### Manual Sync (On Demand)

You can also trigger a manual sync anytime:

```bash
# Run sync script directly
npm run auto-sync

# Or execute manually
bash ./scripts/auto-sync.sh
```

## Cron Jobs

- **Dashboard Data Sync**: Runs every 15 minutes
  - Parses memory files
  - Updates JSON data files
  - Commits and pushes to GitHub
  - Triggers Vercel auto-deployment

The sync script (`scripts/auto-sync.sh`) handles all updates automatically and provides detailed logging for troubleshooting.

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
│   ├── sync-data.js       # Main data sync script
│   └── auto-sync.sh        # Automatic sync cron job (15 min interval)
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
3. **Git Commit**: `auto-sync.sh` commits changes with timestamp
4. **GitHub Push**: Changes are pushed to origin/main
5. **Vercel Deploy**: GitHub Actions triggers automatic deployment
6. **Dashboard Update**: Vercel serves updated data (refreshes every 5 min)

### Automation Features

- **Zero Manual Intervention**: Once cron job is set up, no manual syncs needed
- **Change Detection**: Sync only runs if data has changed
- **Detailed Logging**: All sync operations are timestamped and logged
- **Rollback Support**: Git history allows reverting any problematic changes
- **Deployment Trace**: GitHub Actions logs all deployments with commit SHAs

### Monitoring

**Sync Logs**: `/Users/aira/.openclaw/logs/aira-dashboard-cron.log`
- **GitHub Actions**: https://github.com/aira-wonsai/aira-dashboard/actions
- **Vercel Dashboard**: https://vercel.com/aira-wonsai/aira-dashboard
- **Live Dashboard**: https://aira-dashboard.vercel.app

The entire pipeline is automated and provides multiple monitoring points for any issues.
