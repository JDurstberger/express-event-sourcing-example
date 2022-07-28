import { halMatchers } from '../test-support/hal-matchers'
import { createApp } from '../../app'
import { loadConfiguration } from '../../configuration'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomUUID } from 'crypto'

expect.extend(halMatchers)
expect.extend(extraMatchers)

const configuration = loadConfiguration()

beforeEach(async () => {
  await clearDatabase(configuration.database)
})

describe('Thing', () => {
  test('creates thing', async () => {
    const { app } = await createApp(configuration)
    const system = supertest(app)
    const request = system.post('/things')

    const response = await request

    const resource = Resource.fromJson(response.body)
    const id = resource.getProperty('id')
    expect(response.statusCode).toBe(201)
    expect(id).toBeUuid()
    expect(resource).toContainHref('self', `${request.url}/${id}`)
  })

  test('non existent thing returns not found', async () => {
    const { app } = await createApp(configuration)
    const system = supertest(app)
    const request = system.get(`/things/${randomUUID()}`)

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(404)
    expect(resource).toContainProperty('error', 'resource not found')
  })

  test('thing is accessible via id', async () => {
    const { app } = await createApp(configuration)
    const system = supertest(app)
    const creationResponse = await system.post('/things')
    const createdResource = Resource.fromJson(creationResponse.body)
    const path = new URL(createdResource.getHref('self')!).pathname
    const request = system.get(path)

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource.getProperty('id')).toStrictEqual(
      createdResource.getProperty('id'),
    )
  })

  test('creates creation event for thing', async () => {
    const { app } = await createApp(configuration)
    const system = supertest(app)
    await system.post('/things')

    const response = await system.get('/events')

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(200)
    expect(resource.getResource('events')).toHaveLength(1)
  })
})
