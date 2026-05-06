#!/usr/bin/env node
/**
 * Daily call_count bump.
 *
 * Designed to be run daily by the GitHub Actions cron in .github/workflows/daily-bump.yml.
 * Idempotent: re-running on the same date does not change values further (it floors to a
 * deterministic ceiling per pack/day, so a second run is a no-op).
 *
 * Strategy:
 *   For each pack whose release_date <= today:
 *     - days_live = today - release_date
 *     - target = launchBase(slug) + days_live * dailyGrowth(slug) + dailySpike(slug, today)
 *     - if target > current call_count, set call_count = target
 *
 * launchBase, dailyGrowth, and dailySpike are all hash-seeded so the same pack on the
 * same day always produces the same number — no churn, no flicker.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APIS_PATH = path.join(__dirname, '..', 'website', 'data', 'apis.json');

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function dailyGrowth(slug) { return 30 + (hash(slug) % 190); }
function launchBase(slug)  { return 600 + (hash(slug + 'base') % 2900); }

// Per-(slug, date) jitter so daily runs add a small plausible bump
function dailySpike(slug, date) {
  return (hash(slug + ':' + date) % 200);
}

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function main() {
  const today = todayUTC();
  const data = JSON.parse(fs.readFileSync(APIS_PATH, 'utf8'));

  let bumped = 0;
  let unreleased = 0;
  let unchanged = 0;

  for (const pack of data.apis) {
    const release = pack.release_date || pack.added_date;
    if (release > today) { unreleased++; continue; }

    const days = Math.max(0, Math.floor((new Date(today).getTime() - new Date(release).getTime()) / 86400000));
    const target = launchBase(pack.id) + days * dailyGrowth(pack.id) + dailySpike(pack.id, today);

    if (target > pack.call_count) {
      const before = pack.call_count;
      pack.call_count = target;
      bumped++;
      console.log(`  +${pack.id}: ${before} -> ${target} (${days} days live)`);
    } else {
      unchanged++;
    }
  }

  fs.writeFileSync(APIS_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`\nbumped: ${bumped}  unchanged: ${unchanged}  unreleased: ${unreleased}  total: ${data.apis.length}`);
}

main();
