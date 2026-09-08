import { app } from '../src/app.js';

const runTests = async () => {
  console.log('Testing GET / ...');
  const res1 = await app.request('/');
  console.log('Status /:', res1.status);
  console.log('Body /:', await res1.json());

  console.log('\nTesting GET /health ...');
  const res2 = await app.request('/health');
  console.log('Status /health:', res2.status);
  console.log('Body /health:', await res2.json());

  console.log('\nTesting GET /api/v1/users/profile ...');
  const res3 = await app.request('/api/v1/users/profile');
  console.log('Status /api/v1/users/profile:', res3.status);
  console.log('Body /api/v1/users/profile:', await res3.json());

  console.log('\nTesting 404 handler ...');
  const res4 = await app.request('/not-found');
  console.log('Status /not-found:', res4.status);
  console.log('Body /not-found:', await res4.json());

  console.log('\nAll API endpoints tested successfully!');
};

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
