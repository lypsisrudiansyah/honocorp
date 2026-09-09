import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { db, pool } from '../../config/db.js';
import { users, type NewUser } from '../schema/users.js';

export const seedUsers = async (count: number = 100) => {
  console.log(`Starting seeding of ${count} users...`);

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const dummyUsers: NewUser[] = [];
  const roles: ('admin' | 'manager' | 'staff')[] = ['admin', 'manager', 'staff'];

  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    let email = faker.internet.email().toLowerCase();
    while (usedEmails.has(email)) {
      email = `${i}_${faker.internet.email().toLowerCase()}`;
    }
    usedEmails.add(email);

    dummyUsers.push({
      name: faker.person.fullName(),
      email,
      password: defaultPasswordHash,
      role: roles[Math.floor(Math.random() * roles.length)],
    });
  }

  // Batch insert users into MySQL
  await db.insert(users).values(dummyUsers);
  console.log(`Successfully seeded ${count} dummy users!`);
};

// If run directly via CLI (tsx src/db/seeders/user.seeder.ts)
const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('src/db/seeders/user.seeder.ts');
if (isDirectRun) {
  seedUsers(100)
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seeding failed:', err);
      await pool.end();
      process.exit(1);
    });
}
