/**
 * Database seeder – populates Roles, Brands, and Users.
 *
 * How to run:
 *   npm run seed
 *
 * Optional – override counts via environment variables:
 *   SEED_ROLES=5 SEED_BRANDS=10 SEED_USERS=20 npm run seed
 *
 * Or via CLI arguments:
 *   npx tsx src/seed/seed.ts --roles=5 --brands=10 --users=20
 *
 * After seeding, a fixed admin user is always created:
 *   Email: admin@gmail.com
 *   Password: password123
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDB } from '../utils/db.js';
import { User, Role, Brand } from '../models/index.js';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '../constants/index.js';

const SALT_ROUNDS = 10;

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'password123';

function getCount(key: string, envKey: string, defaultValue: number): number {
  const env = process.env[envKey];
  if (env !== undefined) {
    const n = parseInt(env, 10);
    if (!Number.isNaN(n) && n >= 0) return n;
  }
  const args = process.argv.slice(2);
  for (const arg of args) {
    const match = arg.match(new RegExp(`^--${key}=(\\d+)$`));
    if (match) {
      const n = parseInt(match[1] ?? '0', 10);
      if (n >= 0) return n;
    }
  }
  return defaultValue;
}

const ROLES_COUNT = getCount('roles', 'SEED_ROLES', 50000);
const BRANDS_COUNT = getCount('brands', 'SEED_BRANDS', 50000);
const USERS_COUNT = getCount('users', 'SEED_USERS', 50000);

async function seed(): Promise<void> {
  await connectDB();

  await Role.deleteMany({});
  await Brand.deleteMany({});
  await User.deleteMany({});

  const roles = await Role.insertMany([
    { name: 'Admin', status: STATUS_ACTIVE },
    { name: 'Manager', status: STATUS_ACTIVE },
    { name: 'User', status: STATUS_ACTIVE },
    ...Array.from({ length: Math.max(0, ROLES_COUNT - 3) }, (_, i) => ({
      name: `Role ${i + 4}`,
      status: i % 2 === 0 ? STATUS_ACTIVE : STATUS_INACTIVE,
    })),
  ].slice(0, ROLES_COUNT));

  const brands = await Brand.insertMany([
    ...Array.from({ length: BRANDS_COUNT }, (_, i) => ({
      name: `Brand ${i + 1}`,
      status: i % 2 === 0 ? STATUS_ACTIVE : STATUS_INACTIVE,
      description: i % 2 === 0 ? `Description for brand ${i + 1}` : undefined,
    })),
  ]);

  const defaultRoleId = roles[0]?._id;
  if (!defaultRoleId) {
    console.error('No roles created');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  await User.insertMany([
    {
      firstname: 'Admin',
      lastname: 'User',
      email: ADMIN_EMAIL,
      password: adminPasswordHash,
      role: defaultRoleId,
      status: STATUS_ACTIVE,
    },
    ...Array.from({ length: USERS_COUNT }, (_, i) => ({
      firstname: `First${i + 1}`,
      lastname: `Last${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: hashedPassword,
      role: defaultRoleId,
      status: i % 3 === 0 ? STATUS_INACTIVE : STATUS_ACTIVE,
    })),
  ]);

  console.log(`Seeded: ${roles.length} roles, ${brands.length} brands, ${USERS_COUNT + 1} users (including admin).`);
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
