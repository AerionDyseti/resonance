/**
 * Seed script for development user
 * Creates a default user for local development (no auth required)
 *
 * Run with: bun run scripts/seed-dev-user.ts
 */

import { db, users } from '../src/infrastructure';

/** Well-known dev user ID - use this in tests and development */
export const DEV_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

async function seedDevUser(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding development user...');

  const now = new Date();

  await db
    .insert(users)
    .values({
      id: DEV_USER_ID,
      displayName: 'Dev User',
      email: 'dev@resonance.local',
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  // eslint-disable-next-line no-console
  console.log('✅ Dev user created (or already exists)');
  // eslint-disable-next-line no-console
  console.log(`   ID: ${DEV_USER_ID}`);
  // eslint-disable-next-line no-console
  console.log('   Email: dev@resonance.local');
}

// Run if executed directly
seedDevUser()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
