import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { loadConfiguration } from '../../configuration'
import supertest from 'supertest'
import { Resource } from '../../shared/hal'

expect.extend(halMatchers)

let system: System

beforeEach(async () => {
  system = await createSystem(loadConfiguration())
})

afterEach(async () => {
  await system.shutdown()
})

describe('Discovery', () => {
  it('returns self link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHref('self', request.url)
  })

  it('returns events link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('events', /\/events/)
  })

  it('returns things link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('things', /\/things/)
  })

  it('returns thing link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('thing', /\/things\/{thingId}/)
  })
})
