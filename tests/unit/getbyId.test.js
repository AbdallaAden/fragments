const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Fragment with valid ID found', async () => {
    const fragResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const { id } = JSON.parse(fragResponse.text).fragment;

    const getFrag = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getFrag.statusCode).toBe(200);
  });

  test('Fragment with invalid ID should fail', async () => {
    const res = await request(app).get(`/v1/fragments/noId`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('Fragment with .html extension should be able to convert from markdown', async () => {
    const markFrag = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send('# This is a fragment');
    const { id } = JSON.parse(markFrag.text).fragment;

    const convertFrag = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(convertFrag.headers['content-type']).toBe('text/html'); /*charset=utf-8*/
  });
});
