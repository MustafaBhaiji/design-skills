#!/usr/bin/env node
// Copies the third-party skills, agents and commands listed in vendor.json into this plugin,
// unmodified, from each source repo at its pinned commit. Needs Node 18+ and git.
//
//   node scripts/sync-vendor.mjs            re-copy everything at the pinned commits
//   node scripts/sync-vendor.mjs --latest   move every source to its default branch's latest commit first
//   node scripts/sync-vendor.mjs --notices  only rewrite THIRD_PARTY_NOTICES.md from vendor.json
//
// Only the folders and files named in vendor.json are replaced. The plugin's own skills are never touched.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'vendor.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const latest = process.argv.includes('--latest');
const OWN = new Set(['plan', 'build', 'review', 'critic']);
const SHA = /^[0-9a-f]{40}$/;

const git = (cwd, ...args) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();

function destFor(item) {
  if (item.type === 'skill') return path.join(root, 'skills', item.to);
  if (item.type === 'agent') return path.join(root, 'agents', item.to + '.md');
  if (item.type === 'command') return path.join(root, 'commands', item.to + '.md');
  if (item.type === 'reference') return path.join(root, 'skills', 'build', 'references', item.to);
  throw new Error(`unknown item type: ${item.type}`);
}

function checkout(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `dv-vendor-${source.id}-`));
  git(dir, 'init', '-q');
  git(dir, 'remote', 'add', 'origin', `https://github.com/${source.repo}.git`);
  const ref = latest ? 'HEAD' : source.commit;
  if (!latest && !SHA.test(ref)) throw new Error(`${source.id}: commit must be a full 40-character SHA`);
  git(dir, 'fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', ref);
  const paths = [...source.items.flatMap(itemPaths), ...source.licenseFiles];
  git(dir, 'sparse-checkout', 'set', '--no-cone', ...paths.map((p) => '/' + p));
  git(dir, 'checkout', '-q', 'FETCH_HEAD');
  return { dir, commit: git(dir, 'rev-parse', 'HEAD') };
}

// An item with `include` copies only those parts of `from` (used when a skill lives at a repo root).
function itemPaths(item) {
  if (!item.include) return [item.from];
  return item.include.map((p) => (item.from ? `${item.from}/${p}` : p));
}

function copyItem(srcDir, item) {
  if (item.type === 'skill' && OWN.has(item.to)) throw new Error(`refusing to overwrite own skill: ${item.to}`);
  const to = destFor(item);
  fs.rmSync(to, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const parts = item.include ? item.include : [''];
  for (const part of parts) {
    const from = path.join(srcDir, item.from, part);
    if (!fs.existsSync(from)) throw new Error(`missing in source: ${path.join(item.from, part)}`);
    fs.cpSync(from, path.join(to, part), { recursive: true });
  }
}

const RENAMED_NOTE = (item) => {
  if (item.include) return ` (only ${item.include.map((p) => `\`${p}\``).join(', ')}${item.from ? '' : ' from the repo root'})`;
  return path.basename(item.from).replace(/\.md$/, '') === item.to ? '' : ` (folder renamed from \`${path.basename(item.from)}\`)`;
};

function copyrightLine(sourceId) {
  const dir = path.join(root, 'licenses', sourceId);
  if (!fs.existsSync(dir)) return '';
  for (const f of fs.readdirSync(dir)) {
    const line = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').find((l) => /^\s*Copyright \(c\)|^\s*Copyright \d/i.test(l));
    if (line) return line.trim();
  }
  return '';
}

function writeNotices() {
  const out = [
    '# Third-party notices',
    '',
    'This plugin bundles the skills, agents and commands below. They are copied unmodified from each source repo at the pinned commit by `scripts/sync-vendor.mjs`; the only change is that some folders are renamed so the skill folder matches the skill\'s own name (noted per item). Each remains under its original licence, kept in `licenses/<source>/` or inside the skill folder. They are not covered by this repo\'s own LICENSE.',
    '',
  ];
  for (const s of manifest.sources) {
    const copy = copyrightLine(s.id);
    out.push(`## ${s.repo}`, '');
    out.push(`- Source: https://github.com/${s.repo} at commit \`${s.commit}\``);
    out.push(`- Licence: ${s.license}${copy ? ` (${copy})` : ''}`);
    out.push(`- Licence files: ${s.licenseFiles.length ? s.licenseFiles.map((f) => `\`licenses/${s.id}/${path.basename(f)}\``).join(', ') : 'inside each skill folder'}`);
    out.push('- Bundled:');
    for (const i of s.items) out.push(`  - ${i.type} \`${i.to}\` from \`${i.from || '/'}\`${RENAMED_NOTE(i)}`);
    out.push('');
  }
  fs.writeFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), out.join('\n'));
  console.log('THIRD_PARTY_NOTICES.md written');
}

if (process.argv.includes('--notices')) {
  writeNotices();
  process.exit(0);
}

for (const source of manifest.sources) {
  process.stdout.write(`${source.repo} ... `);
  const { dir, commit } = checkout(source);
  try {
    for (const item of source.items) copyItem(dir, item);
    for (const file of source.licenseFiles) {
      const to = path.join(root, 'licenses', source.id, path.basename(file));
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(path.join(dir, file), to);
    }
    source.commit = commit;
    console.log(`${source.items.length} items at ${commit.slice(0, 7)}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

writeNotices();

if (latest) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('vendor.json updated to the latest commits; review the diff before committing.');
}
