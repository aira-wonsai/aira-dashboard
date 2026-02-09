#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_DIR = __dirname;
const PUBLIC_DIR = path.join(REPO_DIR, 'public/data');
const MEMORY_DIR = '/Users/aira/.openclaw/workspace/memory';

// Function to check if there are changes to commit
function hasChanges() {
  try {
    const output = execSync('git status --porcelain', { cwd: REPO_DIR, encoding: 'utf-8' });
    return output.trim().length > 0;
  } catch (error) {
    console.error('Error checking git status:', error);
    return false;
  }
}

// Function to run the memory parser
function parseMemoryFiles() {
  console.log('📝 Parsing memory files...');
  try {
    execSync('node scripts/parse-memory.js', { cwd: REPO_DIR, stdio: 'inherit' });
  } catch (error) {
    console.error('Error parsing memory files:', error);
    // Don't exit - continue with other data sources
  }
}

// Function to fetch Telegram messages for news
async function fetchTelegramNews() {
  console.log('📰 Fetching news from Telegram...');
  // This would need to be implemented with Telegram API
  // For now, keep existing data
  const newsFile = path.join(PUBLIC_DIR, 'news.json');
  if (fs.existsSync(newsFile)) {
    const data = JSON.parse(fs.readFileSync(newsFile, 'utf-8'));
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(newsFile, JSON.stringify(data, null, 2));
    console.log('✅ News data updated');
  }
}

// Function to fetch Telegram messages for stocks
async function fetchTelegramStocks() {
  console.log('📈 Fetching stocks from Telegram...');
  // This would need to be implemented with Telegram API
  // For now, keep existing data
  const stocksFile = path.join(PUBLIC_DIR, 'stocks.json');
  if (fs.existsSync(stocksFile)) {
    const data = JSON.parse(fs.readFileSync(stocksFile, 'utf-8'));
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(stocksFile, JSON.stringify(data, null, 2));
    console.log('✅ Stocks data updated');
  }
}

// Function to update schedule data
function updateScheduleData() {
  console.log('⏰ Updating schedule data...');
  const scheduleFile = path.join(PUBLIC_DIR, 'schedule.json');
  const schedule = {
    lastUpdated: new Date().toISOString(),
    jobs: [
      {
        name: 'Dashboard Data Sync',
        schedule: 'Every 15 minutes',
        status: 'active',
        description: 'Syncs memory files and Telegram data to dashboard'
      }
    ]
  };
  fs.writeFileSync(scheduleFile, JSON.stringify(schedule, null, 2));
  console.log('✅ Schedule data updated');
}

// Function to commit and push changes
function commitAndPush() {
  try {
    console.log('📤 Committing and pushing changes...');
    execSync('git add public/data/', { cwd: REPO_DIR, stdio: 'inherit' });
    execSync('git commit -m "Update dashboard data [auto-sync]"', { cwd: REPO_DIR, stdio: 'inherit' });
    execSync('git push origin main', { cwd: REPO_DIR, stdio: 'inherit' });
    console.log('✅ Changes committed and pushed to GitHub');
  } catch (error) {
    console.error('Error committing/pushing:', error);
    // If nothing to commit, that's okay
    if (!error.message.includes('nothing to commit')) {
      throw error;
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting dashboard data sync...');
  console.log(`   Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);

  try {
    // Parse memory files
    parseMemoryFiles();

    // Fetch Telegram data (placeholder for now)
    await fetchTelegramNews();
    await fetchTelegramStocks();

    // Update schedule
    updateScheduleData();

    // Commit and push if there are changes
    if (hasChanges()) {
      commitAndPush();
    } else {
      console.log('ℹ️  No changes to commit');
    }

    console.log('✅ Dashboard data sync completed successfully');
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

main();
