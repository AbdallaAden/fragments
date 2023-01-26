// tests/unit/app.test.js

const request = require('supertest');
//const logger = require('../../src/logger');

const app = require('../../src/app');

describe("requests for resources that can't be found can't be found", () => {
  test('should return a 404 response', () => request(app).get('/notrealpage').expect(401));
});
