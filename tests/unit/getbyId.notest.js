// const request = require('supertest');
// const app = require('../../src/app');
// const logger = require('../../src/');

// describe('GET /v1/fragments/:id', () => {
//   test('should return the fragment if it exists', async () => {
//     const data = Buffer.from('hello');
//     const res = await request(app)
//       .post('/v1/fragments')
//       .auth('user1@email.com', 'password1')
//       .send(data);
//     // const body = JSON.parse(res.text).fragment.id
//     logger.info(JSON.parse(res.text).fragment);
//     const id = JSON.parse(res.text.fragment.id);
//     const res1 = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
//     expect(res1.statusCode).toBe(200);
//     //expect(res.body.fragment).toEqual(fragment);
//   });

//   test('should return a 401 error if the user is not authorized', async () => {
//     const res = await request(app);
//     const id = JSON.parse(res.text).fragment.id;
//     const res1 = await request(app).get(`/v1/fragments/${id}`);

//     expect(res1.statusCode).toBe(401);
//     expect(res1.body.status).toBe('error');
//     expect(res1.body.message).toBe('Unauthorized');
//   });
// });
