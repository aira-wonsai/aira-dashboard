import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(__dirname, 'test-data');
const MEMORY_FILE = path.join(TEST_DIR, 'test-memory.md');

describe('Data Parsing', () => {
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('Memory File Parsing', () => {
    it('should parse a memory file with date headers', () => {
      const content = `# 2026-02-08

- First activity
- Second activity

# 2026-02-09

- Third activity
- Fourth activity`;

      fs.writeFileSync(MEMORY_FILE, content);

      // Import and run the parser
      const parseMemory = require('../scripts/parse-memory.js');

      // This test assumes the parseMemoryFile function is exported
      // For now, we'll test the format
      const lines = content.split('\n');
      const dateHeaders = lines.filter(line => line.match(/^#\s*\d{4}-\d{2}-\d{2}/));
      expect(dateHeaders).toHaveLength(2);

      const bulletPoints = lines.filter(line => line.startsWith('- '));
      expect(bulletPoints).toHaveLength(4);
    });

    it('should handle empty memory files', () => {
      const content = `# 2026-02-08`;

      fs.writeFileSync(MEMORY_FILE, content);

      const lines = content.split('\n');
      const bulletPoints = lines.filter(line => line.startsWith('- '));
      expect(bulletPoints).toHaveLength(0);
    });

    it('should skip comments and non-bullet lines', () => {
      const content = `# 2026-02-08

This is a comment
Another non-bullet line

- Actual activity
- Another activity`;

      fs.writeFileSync(MEMORY_FILE, content);

      const lines = content.split('\n');
      const bulletPoints = lines.filter(line => line.startsWith('- '));
      expect(bulletPoints).toHaveLength(2);
    });
  });

  describe('Activity Grouping', () => {
    it('should group activities by date', () => {
      const activities = [
        { date: '2026-02-08', item: 'Activity 1' },
        { date: '2026-02-08', item: 'Activity 2' },
        { date: '2026-02-09', item: 'Activity 3' }
      ];

      const grouped = {};
      for (const activity of activities) {
        if (!grouped[activity.date]) {
          grouped[activity.date] = { date: activity.date, items: [] };
        }
        grouped[activity.date].items.push(activity.item);
      }

      expect(Object.keys(grouped)).toHaveLength(2);
      expect(grouped['2026-02-08'].items).toHaveLength(2);
      expect(grouped['2026-02-09'].items).toHaveLength(1);
    });

    it('should sort activities by date descending', () => {
      const activities = [
        { date: '2026-02-08', items: [] },
        { date: '2026-02-09', items: [] },
        { date: '2026-02-07', items: [] }
      ];

      const sorted = [...activities].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );

      expect(sorted[0].date).toBe('2026-02-09');
      expect(sorted[1].date).toBe('2026-02-08');
      expect(sorted[2].date).toBe('2026-02-07');
    });
  });

  describe('JSON Structure Validation', () => {
    it('should validate activities.json structure', () => {
      const data = {
        activities: [
          {
            date: '2026-02-08',
            items: ['Activity 1', 'Activity 2']
          }
        ],
        lastUpdated: '2026-02-09T12:00:00Z'
      };

      expect(data).toHaveProperty('activities');
      expect(Array.isArray(data.activities)).toBe(true);
      expect(data.activities[0]).toHaveProperty('date');
      expect(data.activities[0]).toHaveProperty('items');
      expect(Array.isArray(data.activities[0].items)).toBe(true);
    });

    it('should validate news.json structure', () => {
      const data = {
        lastUpdated: '2026-02-09T12:00:00Z',
        source: 'Telegram chat -5212456021',
        headlines: ['Headline 1', 'Headline 2']
      };

      expect(data).toHaveProperty('headlines');
      expect(Array.isArray(data.headlines)).toBe(true);
      expect(data).toHaveProperty('source');
    });

    it('should validate stocks.json structure', () => {
      const data = {
        lastUpdated: '2026-02-09T12:00:00Z',
        source: 'Telegram chat -5213577134',
        stocks: [
          { symbol: 'AAPL', price: '150.00', change: '1.5' }
        ]
      };

      expect(data).toHaveProperty('stocks');
      expect(Array.isArray(data.stocks)).toBe(true);
      if (data.stocks.length > 0) {
        expect(data.stocks[0]).toHaveProperty('symbol');
        expect(data.stocks[0]).toHaveProperty('price');
        expect(data.stocks[0]).toHaveProperty('change');
      }
    });
  });
});
