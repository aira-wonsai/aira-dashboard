#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '/Users/aira/.openclaw/workspace/memory';
const OUTPUT_FILE = path.join(__dirname, '../public/data/activities.json');

function parseMemoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  const activities = [];

  let currentDate = null;
  for (const line of lines) {
    // Match date header (e.g., # 2026-02-08)
    const dateMatch = line.match(/^#\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      currentDate = dateMatch[1];
      continue;
    }

    // Match bullet points
    if (line.startsWith('- ')) {
      const item = line.substring(2).trim();
      if (item && currentDate) {
        activities.push({
          date: currentDate,
          item: item
        });
      }
    }
  }

  return activities;
}

function groupActivitiesByDate(activities) {
  const grouped = {};

  for (const activity of activities) {
    if (!grouped[activity.date]) {
      grouped[activity.date] = {
        date: activity.date,
        items: []
      };
    }
    grouped[activity.date].items.push(activity.item);
  }

  // Convert to array and sort by date descending
  return Object.values(grouped).sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );
}

function main() {
  try {
    if (!fs.existsSync(MEMORY_DIR)) {
      console.log(`Memory directory not found: ${MEMORY_DIR}`);
      process.exit(0);
    }

    const files = fs.readdirSync(MEMORY_DIR)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse(); // Process newest first

    console.log(`Found ${files.length} memory files`);

    const allActivities = [];

    for (const file of files) {
      const filePath = path.join(MEMORY_DIR, file);
      console.log(`Parsing: ${file}`);
      const activities = parseMemoryFile(filePath);
      allActivities.push(...activities);
    }

    const grouped = groupActivitiesByDate(allActivities);

    const output = {
      activities: grouped,
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`✅ Parsed ${allActivities.length} activities into ${OUTPUT_FILE}`);
    console.log(`   Activities span ${grouped.length} days`);

  } catch (error) {
    console.error('Error parsing memory files:', error);
    process.exit(1);
  }
}

main();
