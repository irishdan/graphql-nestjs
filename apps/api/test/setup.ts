import * as dotenv from 'dotenv';
import { execSync } from 'node:child_process';

module.exports = async () => {
  // Force-load test env
  dotenv.config({ path: '.env.e2e', override: true });

  execSync('yarn docker:up', { stdio: 'inherit', env: process.env });
  // Do any db resetting/fixtures etc etc
  // ...
};
