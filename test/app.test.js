const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('responds with hello', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Hello from CI\/CD demo!/);
  });
});
