// Lingo monitoring configuration — one place for environment, base URL and UA settings.
require('dotenv').config();

const ENVS = {
  prod: 'https://www.adobe.com',
  stage: 'https://www.stage.adobe.com',
};

const env = (process.env.LINGO_ENV || 'prod').toLowerCase();

module.exports = {
  env,
  // BASE_URL wins over LINGO_ENV (handy for ad-hoc runs against a branch / preview host).
  baseURL: process.env.BASE_URL || ENVS[env] || ENVS.prod,
  // Appended to every browser user agent. Allow-listed by the edge team (same as Nala/Milo).
  // Set UA_SUFFIX= (empty) to disable.
  userAgentSuffix: process.env.UA_SUFFIX ?? 'NALA-Acom',
  slackWebhookEnv: 'SLACK_WEBHOOK_URL',
};
