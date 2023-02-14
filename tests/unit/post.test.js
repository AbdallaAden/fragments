// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

const local = 'http://localhost:8080';

describe('post /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('create a fragment with an unsupported type errors as expected', async () => {
    //const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'abcdefg')
      .send('fragment test');
    expect(res.statusCode).toBe(415);
  });

  test('empty posts test', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send();

    expect(res.statusCode).toBe(500);
  });

  test('authenticated users can create text/plain fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain'));
  });

  test('responses include all necessary and expected properties', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const body = JSON.parse(res.text);
    expect(Object.keys(body.fragment)).toEqual([
      'id',
      'ownerId',
      'created',
      'updated',
      'type',
      'size',
    ]);
    expect(body.fragment.size).toEqual(data.byteLength);
    expect(body.fragment.type).toContain('text/plain');
  });

  test('response includes Location header to GET fragment', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(
      `${local}/v1/fragments/${JSON.parse(res.text).fragment.id}`
    );
  });
});
