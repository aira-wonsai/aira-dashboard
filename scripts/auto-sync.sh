#!/bin/bash

# Auto-sync script for Aira Dashboard
# Runs every 15 minutes to:
# 1. Parse memory files and update JSON data
# 2. Commit and push changes to GitHub
# 3. Trigger Vercel auto-deployment

set -e  # Exit on error

cd "$(dirname "$0")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Starting Aira Dashboard auto-sync..."

# Create data directory if it doesn't exist
mkdir -p public/data

# Create data files if they don't exist
touch public/data/activities.json
touch public/data/news.json
touch public/data/stocks.json
touch public/data/moltbook.json
touch public/data/schedule.json

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📊 Running data sync..."

# Run data sync (this will create/update JSON files)
npm run sync 2>&1

# Check if there are changes
if git diff --quiet --exit-code; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Changes detected, committing..."
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
    
    # Push to GitHub (triggers Vercel auto-deployment)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📤 Pushing to GitHub (will trigger Vercel deploy)..."
    git push origin main
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Successfully synced and deployed!"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ No changes, already up to date"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Auto-sync complete"
