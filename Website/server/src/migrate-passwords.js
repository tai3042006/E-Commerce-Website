import 'dotenv/config';
import { getPool } from './db.js';

// Simple hash function (same as before) - for detecting legacy hashes only
function simpleHash(plain) {
  let h = 0x811c9dc5;
  for (let i = 0; i < plain.length; i++) {
    h ^= plain.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + plain.length.toString(16);
}

// Verify password against stored hash (supports both simpleHash and bcrypt)
async function verifyPassword(plain, stored) {
  if (stored.startsWith('$2b$') || stored.startsWith('$2a$') || stored.startsWith('$2y$')) {
    return await bcrypt.compare(plain, stored);
  }
  // Assume it's a legacy simpleHash
  return simpleHash(plain) === stored;
}

async function migratePasswords() {
  const pool = await getPool();
  try {
    // Select all users
    const [users] = await pool.query('SELECT id, email, password FROM users');
    console.log(`Found ${users.length} users`);

    let legacyCount = 0;
    let bcryptCount = 0;

    for (const user of users) {
      const { id, email, password } = user;
      // Check if password is already bcrypt
      if (password.startsWith('$2b$') || password.startsWith('$2a$') || password.startsWith('$2y$')) {
        bcryptCount++;
        continue;
      }
      // Assume it's a legacy simpleHash
      legacyCount++;
      // We cannot migrate without the plaintext password.
      // Instead, we rely on the upgrade-on-login mechanism in auth.js and settings.js.
      console.log(`User ${email} (id: ${id}) has legacy hash. Will be upgraded on next successful login.`);
    }

    console.log(`\nSummary:`);
    console.log(`- Legacy (simpleHash) passwords: ${legacyCount}`);
    console.log(`- Bcrypt passwords: ${bcryptCount}`);
    console.log(`\nNote: Automatic migration of legacy passwords is not possible without plaintext.`);
    console.log(`Legacy passwords will be upgraded to bcrypt when the user logs in or changes their password.`);
  } finally {
    await pool.end();
  }
}

migratePasswords().catch(err => {
  console.error('[migrate-passwords] Error:', err);
  process.exit(1);
});