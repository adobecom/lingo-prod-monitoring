# Lingo prod monitoring

Daily Playwright monitor for the Lingo release on https://www.adobe.com — desktop + mobile (Chrome & Safari engines), Slack summary, GitHub Actions schedule.

```bash
npm install && npx playwright install --with-deps chrome webkit
npm run selftest
npm test                       # all 4 browser projects
npx playwright test --grep @akamai --project=desktop-chrome --headed
```

**Everything else — coverage map, how to add tests, Slack setup, troubleshooting, open questions — is in [SKILL.md](./SKILL.md).**
