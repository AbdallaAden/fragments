const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Fragment with invalid ID should fail', async () => {
    const res = await request(app).put(`/v1/fragments/noId`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
  });
  test('Fragment with valid ID should pass', async () => {
    const fragResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const { id } = JSON.parse(fragResponse.text).fragment;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a new fragment');
    expect(res.statusCode).toBe(200);
  });
});
