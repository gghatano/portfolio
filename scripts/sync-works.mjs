#!/usr/bin/env node
/**
 * src/content/works/*.json の API 由来フィールド（language / updated / stars）を洗い替え、
 * 公開ページの生死と、まだ掲載していないリポジトリを報告する。
 *
 *   node scripts/sync-works.mjs           # 差分を表示するだけ
 *   node scripts/sync-works.mjs --write   # JSON を書き換える
 *
 * GitHub API は gh CLI 経由で叩く（認証済みの gh が必要）。
 * title / summary / category / site_url は手で書くフィールドなので触らない。
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/works';
const OWNER = 'gghatano';
const write = process.argv.includes('--write');

const gh = (path) =>
  JSON.parse(execFileSync('gh', ['api', path, '--paginate'], { encoding: 'utf8', maxBuffer: 32e6 }));

const alive = async (url) => {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    return res.status;
  } catch {
    return 0;
  }
};

const files = readdirSync(DIR).filter((f) => f.endsWith('.json'));
const changes = [];
const dead = [];
const listed = new Set();

for (const file of files) {
  const path = join(DIR, file);
  const entry = JSON.parse(readFileSync(path, 'utf8'));
  listed.add(entry.repo);

  const repo = gh(`repos/${entry.repo}`);
  const next = {
    language: repo.language ?? undefined,
    updated: repo.updated_at.slice(0, 10),
    stars: repo.stargazers_count,
  };

  const diff = Object.entries(next).filter(([k, v]) => entry[k] !== v && !(v === undefined && !(k in entry)));
  if (diff.length > 0) {
    changes.push(`${file}: ${diff.map(([k, v]) => `${k} ${entry[k] ?? '-'} → ${v ?? '-'}`).join(', ')}`);
    if (write) {
      const merged = { ...entry, ...next };
      if (merged.language === undefined) delete merged.language;
      writeFileSync(path, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    }
  }

  const status = await alive(entry.site_url);
  if (status !== 200) dead.push(`${file}: ${entry.site_url} → HTTP ${status || 'error'}`);
}

// 掲載候補: 公開ページを持ちそうな non-fork リポジトリのうち、まだ works にないもの。
const candidates = [];
for (const r of gh(`users/${OWNER}/repos?per_page=100`)) {
  if (r.fork || r.archived || listed.has(r.full_name)) continue;
  if (!r.has_pages && !r.homepage) continue;
  const url = r.homepage || `https://${OWNER}.github.io/${r.name}/`;
  if ((await alive(url)) === 200) candidates.push(`${r.full_name}: ${url}`);
}

const report = (title, lines) => {
  console.log(`\n## ${title}（${lines.length}）`);
  for (const l of lines) console.log(`  ${l}`);
};

report(write ? '更新した項目' : '更新が必要な項目', changes);
report('リンク切れ（要対応）', dead);
report('未掲載の公開ページ', candidates);
if (!write && changes.length > 0) console.log('\n--write を付けると JSON に反映します。');
