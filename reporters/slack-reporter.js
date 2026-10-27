/**
 * Custom Playwright reporter: posts ONE daily summary to Slack (incoming webhook) when the run ends.
 *
 * Env:
 *   SLACK_WEBHOOK_URL   required to post (missing = summary is printed only; run still succeeds)
 *   SLACK_MENTION       optional, e.g. "<!subteam^S0123456>" or "<@U0123456>" — tagged only when something failed
 *   LINGO_ENV / BASE_URL  shown in the message
 *   GITHUB_*            run link is added automatically on GitHub Actions
 *
 * Also writes reports/summary.json and (after a successful post) reports/.slack-sent, which the workflow
 * uses to know whether it needs to send a "run crashed" fallback message.
 */
const fs = require('node:fs');
const path = require('node:path');
const lingo = require('../lingo.config');

const OUT_DIR = path.resolve(__dirname, '../reports');
const ANSI = /\u001b\[[0-9;]*m/g;
const firstLine = (msg = '') => msg.replace(ANSI, '').split('\n').map((l) => l.trim()).find(Boolean) || 'failed';
const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

class SlackReporter {
  onBegin(config, suite) { this.suite = suite; this.started = Date.now(); }

  async onEnd(result) {
    const summary = this.summarise();
    summary.status = result.status;
    summary.durationSec = Math.round((Date.now() - this.started) / 1000);

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

    const payload = this.buildPayload(summary);
    const url = process.env[lingo.slackWebhookEnv];
    if (!url) { console.log(`[slack-reporter] ${lingo.slackWebhookEnv} not set — skipping Slack post.`); return; }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
      fs.writeFileSync(path.join(OUT_DIR, '.slack-sent'), new Date().toISOString());
      console.log('[slack-reporter] report posted to Slack.');
    } catch (e) {
      console.error(`[slack-reporter] could not post to Slack: ${e.message}`);
    }
  }

  summarise() {
    const s = { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0, categories: {}, projects: {}, failures: [] };
    for (const t of this.suite.allTests()) {
      const project = t.titlePath()[1] || 'default';
      const category = t.parent?.title || 'Other';
      const outcome = t.outcome(); // expected | unexpected | flaky | skipped
      const bucket = (m, k) => (m[k] ||= { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0 });
      s.total += 1;
      for (const b of [bucket(s.categories, category), bucket(s.projects, project)]) {
        b.total += 1;
        if (outcome === 'expected') b.passed += 1;
        else if (outcome === 'flaky') b.flaky += 1;
        else if (outcome === 'skipped') b.skipped += 1;
        else b.failed += 1;
      }
      if (outcome === 'expected') s.passed += 1;
      else if (outcome === 'flaky') s.flaky += 1;
      else if (outcome === 'skipped') s.skipped += 1;
      else {
        s.failed += 1;
        const last = t.results[t.results.length - 1];
        const reasons = [...new Set((last?.errors || []).map((e) => firstLine(e.message)))].slice(0, 3);
        s.failures.push({ project, category, title: t.title.split(',')[0], reasons });
      }
    }
    return s;
  }

  buildPayload(s) {
    const ok = s.failed === 0 && s.status !== 'interrupted' && s.total > 0;
    const icon = ok ? (s.flaky ? '🟡' : '✅') : '❌';
    const headline = ok ? (s.flaky ? 'PASSED (with flaky retries)' : 'ALL PASSED') : `${s.failed} FAILED`;
    const env = `${lingo.env} (${lingo.baseURL})`;
    const when = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const runUrl = process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null;

    const line = (name, b) => `${b.failed ? '❌' : b.flaky ? '🟡' : '✅'} ${name} — ${b.passed + b.flaky}/${b.total}${b.failed ? ` (${b.failed} failed)` : ''}${b.flaky ? ` (${b.flaky} flaky)` : ''}`;
    const cats = Object.entries(s.categories).map(([n, b]) => line(n.replace(/^Lingo \| /, ''), b)).join('\n');
    const projs = Object.entries(s.projects).map(([n, b]) => line(n, b)).join('\n');

    let failureText = '';
    if (s.failures.length) {
      failureText = s.failures.slice(0, 15)
        .map((f) => `• *[${f.project}]* ${f.title}\n${f.reasons.map((r) => `    ↳ ${cut(r, 160)}`).join('\n')}`).join('\n');
      if (s.failures.length > 15) failureText += `\n…and ${s.failures.length - 15} more (see the report).`;
    }

    const blocks = [
      { type: 'header', text: { type: 'plain_text', text: `${icon} Lingo prod monitoring — ${headline}`.slice(0, 150) } },
      { type: 'section', fields: [
        { type: 'mrkdwn', text: `*Environment*\n${env}` },
        { type: 'mrkdwn', text: `*Run*\n${when} · ${s.durationSec}s` },
        { type: 'mrkdwn', text: `*Checks*\n${s.total} (${s.passed} passed · ${s.failed} failed · ${s.flaky} flaky)` },
      ] },
      { type: 'section', text: { type: 'mrkdwn', text: cut(`*By category*\n${cats}`, 2900) } },
      { type: 'section', text: { type: 'mrkdwn', text: cut(`*By browser*\n${projs}`, 2900) } },
    ];
    if (failureText) blocks.push({ type: 'section', text: { type: 'mrkdwn', text: cut(`*Failures*\n${failureText}`, 2900) } });
    blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: runUrl ? `<${runUrl}|Open run · HTML report & traces in artifacts>` : 'Local run — open reports/html/index.html' }] });

    const mention = !ok && process.env.SLACK_MENTION ? `${process.env.SLACK_MENTION} ` : '';
    return { text: `${mention}${icon} Lingo prod monitoring — ${headline}`, blocks };
  }

  printsToStdio() { return false; }
}

module.exports = SlackReporter;
