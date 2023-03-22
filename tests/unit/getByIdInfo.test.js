const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('should return the fragment if it exists', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('Testing fragment');
    const { id } = JSON.parse(res.text).fragment;
    const res1 = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res1.statusCode).toBe(200);
    //expect(res.body.fragment).toEqual(fragment);
  });

  test('should return a 401 error if the user is not authorized', async () => {
    const data = Buffer.from('hello');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('fakeUser@email.com', 'fakePassword')
      .send(data);
    expect(res.statusCode).toBe(401);
  });
});
