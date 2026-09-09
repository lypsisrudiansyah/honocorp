import { app } from '../src/app.js';
import { parsePagination, createPaginationMeta } from '../src/utils/pagination.util.js';

const runTests = async () => {
  console.log('--- Testing Pagination Utility ---');
  const pagination1 = parsePagination({ page: '2', limit: '15' });
  console.log('Parsed pagination:', pagination1);
  if (pagination1.page !== 2 || pagination1.limit !== 15 || pagination1.offset !== 15) {
    throw new Error('Pagination calculation mismatch');
  }

  const meta = createPaginationMeta(100, 2, 15);
  console.log('Pagination meta:', meta);
  if (meta.totalPages !== 7 || !meta.hasNextPage || !meta.hasPrevPage) {
    throw new Error('Pagination meta mismatch');
  }

  console.log('\n--- Testing GET / ---');
  const res1 = await app.request('/');
  console.log('Status /:', res1.status);
  console.log('Body /:', await res1.json());

  console.log('\n--- Testing GET /health ---');
  const res2 = await app.request('/health');
  console.log('Status /health:', res2.status);
  console.log('Body /health:', await res2.json());

  console.log('\n--- Testing GET /api/v1/users/profile ---');
  const res3 = await app.request('/api/v1/users/profile');
  console.log('Status /api/v1/users/profile:', res3.status);
  console.log('Body /api/v1/users/profile:', await res3.json());

  console.log('\n--- Testing 404 handler ---');
  const res4 = await app.request('/not-found');
  console.log('Status /not-found:', res4.status);
  const body4 = await res4.json();
  console.log('Body /not-found:', body4);
  if (res4.status !== 404 || body4.success !== false) {
    throw new Error('404 handler failed');
  }

  console.log('\n--- Testing POST /api/v1/auth/register validation failure ---');
  const res5 = await app.request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'A', // Too short (< 2)
      email: 'not-an-email', // Invalid email
      password: 'short', // Too short (< 8)
    }),
  });
  console.log('Status /register validation failure:', res5.status);
  const body5 = await res5.json();
  console.log('Body /register validation failure:', body5);
  if (res5.status !== 422 || body5.success !== false || body5.code !== 'VALIDATION_ERROR') {
    throw new Error('Validation error handling failed');
  }

  console.log('\n--- Testing POST /api/v1/projects validation failure ---');
  const res6 = await app.request('/api/v1/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'P', // Too short (< 3)
      ownerId: -5, // Invalid ID
    }),
  });
  console.log('Status /projects validation failure:', res6.status);
  const body6 = await res6.json();
  console.log('Body /projects validation failure:', body6);
  if (res6.status !== 422 || body6.success !== false) {
    throw new Error('Project validation error handling failed');
  }

  console.log('\nAll tests passed successfully!');
};

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
