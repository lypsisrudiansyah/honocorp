import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, pool } from '../config/db.js';

const runMigration = async () => {
  console.log('⏳ Running database migrations...');
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Database migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigration();
