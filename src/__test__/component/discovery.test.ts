import {halMatchers} from "../test-support/hal-matchers";
import {createApp} from "../../app";
import {loadConfiguration} from "../../configuration";
import supertest from 'supertest';
import {Resource} from "../../shared/hal";

expect.extend(halMatchers)

describe('Discovery', () => {
  it('returns self link', async () => {
    const {app} = await createApp(loadConfiguration())
    const request = supertest(app).get("/");

    const response = await request;

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200);
    expect(resource).toContainHref('self', request.url)
  })
})
