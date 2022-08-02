import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { loadConfiguration } from '../test-support/configuration'
import supertest from 'supertest'
import { Resource } from '../../shared/hal'

expect.extend(halMatchers)

let system: System

beforeEach(async () => {
  system = await createSystem(loadConfiguration())
})

afterEach(async () => {
  await system?.shutdown()
})

describe('Discovery', () => {
  test('returns self link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHref('self', request.url)
  })

  test('returns events link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('events', /\/events$/)
  })

  test('returns event link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('event', /\/events\/{eventId}$/)
  })

  test('returns things link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('things', /\/things$/)
  })

  test('returns thing link', async () => {
    const request = supertest(system.app).get('/')

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource).toContainHrefMatching('thing', /\/things\/{thingId}$/)
  })
})
