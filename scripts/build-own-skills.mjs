#!/usr/bin/env node
// Maintainer tool. Rebuilds the plugin's four stage skills (skills/plan, build, review, critic) from the
// maintainer's local dv-* skills in ~/.claude/skills, renaming every skill and agent reference to the
// plugin's dv: namespace and dropping local-only parts (install prerequisites, local paths).
//
//   node scripts/build-own-skills.mjs            write into this repo
//   node scripts/build-own-skills.mjs <dir>      write into another checkout
//
// Bundled third-party skills are handled separately by scripts/sync-vendor.mjs.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const repo = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const src = path.join(os.homedir(), '.claude', 'skills');
const stages = { 'dv-plan': 'plan', 'dv-build': 'build', 'dv-review': 'review', 'dv-critic': 'critic' };
const plain = 'awwwards design-taste-frontend high-end-visual-design gpt-taste animate choreograph mobile-native frontend-design pick-ui-library animate-expo write-swift lean-build migration safe-refactor animation-performance break-ui review-animations investigate-first surgical-patch verify-and-stop redesign-existing-projects theme-factory full-output-enforcement jury impeccable hallmark oil-ui ui-ux-pro-max motion-design android-native-dev ios-application-dev flutter-dev react-native-dev threejs webgl-landing-steering 3d-retina-resolution audit-reference-originality stitched-full-page-capture'.split(' ');

const SYSTEM_DESIGN_OLD = 'System design requests (ERP, platform, portal): the deliverable follows the "System design output format" in the global CLAUDE.md (Design canvas). Load `full-output-enforcement` for it so no screen or dialog is skipped.';
const SYSTEM_DESIGN_NEW = `System design requests (ERP, app, platform, portal): deliver a design canvas with an overview board first (system name, three key pillars, a screen index grouped by module, each entry linking to its board), then one page per module with numbered boards ("08 · Bookings"). Every screen and every dialog gets its own board; dialogs sit over a dimmed app shell. Shared sidebar and top bar are reusable components, and navigation links boards so the canvas clicks through. Desktop 1440px unless told otherwise; client work uses the client's real branding; sample data is realistic and labelled illustrative. Load \`full-output-enforcement\` for it so no screen or dialog is skipped.`;

function transform(text) {
  let t = text.replace(SYSTEM_DESIGN_OLD, SYSTEM_DESIGN_NEW);
  if (t.includes('global CLAUDE.md')) throw new Error('system design line not replaced');
  t = t.replace('`~/.claude/skills/dv-build/references/ui-sources.md`', '`../build/references/ui-sources.md` (the dv:build skill folder, next to this one)');
  t = t.split('~/.claude/skills/dv-build/references/').join('../build/references/');
  if (t.includes('~/.claude')) throw new Error('local path left in plugin copy');
  // namespaced references inside backticks
  t = t.replace(/`(?:ecc|design|data|anthropic-skills):([a-z0-9-]+)`/g, '`dv:$1`');
  // plain skill names inside backticks
  for (const n of plain) t = t.split('`' + n + '`').join('`dv:' + n + '`');
  // stage commands
  for (const [old, neu] of Object.entries(stages)) t = t.split('/' + old).join('/dv:' + neu);
  // upstream retired these two skills: redesign moved into design-taste-frontend; full-output-enforcement was removed
  t = t.split('`dv:design-system`, `dv:redesign-existing-projects`').join('`dv:design-system`, `dv:design-taste-frontend` (its redesign route)');
  t = t.split(' Load `dv:full-output-enforcement` for it so no screen or dialog is skipped.').join('');
  // the plugin bundles these skills, so the local install prerequisites don't apply
  t = t.replace(/\n\*\*Prerequisites\.\*\*[^\n]*\n```[\s\S]*?```\n[^\n]*\n/g, '\n');
  t = t.replace(/\n\*\*Prerequisite\.\*\*[^\n]*\n/g, '\n');
  if (t.includes('Prerequisite') || t.includes('npx skills add')) throw new Error('prerequisites block not removed');
  for (const gone of ['dv:redesign-existing-projects', 'dv:full-output-enforcement']) {
    if (t.includes(gone)) throw new Error('retired skill still referenced: ' + gone);
  }
  return t;
}

for (const [dir, name] of Object.entries(stages)) {
  const raw = fs.readFileSync(path.join(src, dir, 'SKILL.md'), 'utf8');
  const out = transform(raw).replace(/^name: .*$/m, 'name: ' + name);
  const dest = path.join(repo, 'skills', name);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, 'SKILL.md'), out);
}
fs.mkdirSync(path.join(repo, 'skills', 'build', 'references'), { recursive: true });
fs.copyFileSync(path.join(src, 'dv-build', 'references', 'ui-sources.md'), path.join(repo, 'skills', 'build', 'references', 'ui-sources.md'));
console.log('wrote 4 skills + ui-sources');
