const assert = require('assert');
const request = require('supertest');
const server = require('../index');

describe('GET /', function() {
  it('responds with status code 200', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});

after(function(done) {
  server.close(done);
});