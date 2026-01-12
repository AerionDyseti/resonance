#!/usr/bin/env bun
/**
 * Publish script for @aeriondyseti/resonance-airp
 *
 * Prerequisites:
 * 1. Create a granular access token at https://www.npmjs.com/settings/tokens
 * 2. Store it: npm config set //registry.npmjs.org/:_authToken=npm_YOUR_TOKEN
 *    Or set NPM_TOKEN environment variable
 *
 * Usage: bun run scripts/publish.ts [--dry-run]
 */

import { $ } from 'bun';

const dryRun = process.argv.includes('--dry-run');

async function main() {
  // Check for authentication
  console.log('🔐 Checking NPM authentication...');
  try {
    const whoami = await $`npm whoami`.text();
    console.log(`✅ Authenticated as: ${whoami.trim()}`);
  } catch {
    console.error('❌ Not authenticated with NPM.');
    console.error('   Option 1: npm login');
    console.error('   Option 2: npm config set //registry.npmjs.org/:_authToken=npm_YOUR_TOKEN');
    console.error('   Option 3: Set NPM_TOKEN environment variable');
    process.exit(1);
  }

  // Type check
  console.log('🔍 Running type check...');
  const typeCheck = await $`bun run type-check`.quiet();
  if (typeCheck.exitCode !== 0) {
    console.error('❌ Type check failed. Aborting publish.');
    console.error(typeCheck.stderr.toString());
    process.exit(1);
  }
  console.log('✅ Type check passed');

  // Get version info
  const pkg = await Bun.file('package.json').json();
  console.log(`\n📦 Publishing ${pkg.name}@${pkg.version}...`);

  if (dryRun) {
    console.log('🔍 Dry run - would publish:');
    await $`npm publish --dry-run --access public --tag alpha`;
  } else {
    await $`npm publish --access public --tag alpha`;
    console.log(`\n✅ Published ${pkg.name}@${pkg.version}`);
    console.log(`\n📋 Users can now run:`);
    console.log(`   bunx --bun ${pkg.name}@alpha`);
  }
}

main().catch((err) => {
  console.error('❌ Publish failed:', err.message);
  process.exit(1);
});
