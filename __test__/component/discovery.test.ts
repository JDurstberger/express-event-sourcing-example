import {halMatchers} from "../test-support/hal-matchers";
import {app} from '../../src/app';
import supertest = require('supertest');

expect.extend(halMatchers)

describe('Discovery', () => {
  it('returns self link', async () => {
    const request = supertest(app).get("/");
    const response = await request;

    expect(response.statusCode).toBe(200);
    expect(response.body).toContainHref('self', request.url)
  })
})
