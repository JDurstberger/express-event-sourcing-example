import { halMatchers } from '../test-support/hal-matchers'
import { createSystem, System } from '../../system'
import { Resource } from '../../shared/hal'
import { extraMatchers } from '../test-support/extra-matchers'
import supertest from 'supertest'
import { clearDatabase } from '../test-support/database'
import { randomThingBody, randomName } from '../test-support/data'
import { loadConfiguration } from '../test-support/configuration'

expect.extend(halMatchers)
expect.extend(extraMatchers)

const configuration = loadConfiguration()
let system: System

beforeEach(async () => {
  await clearDatabase(configuration.database)
  system = await createSystem(configuration)
})

afterEach(async () => {
  await system?.shutdown()
})

describe('Thing Creation', () => {
  test('creates thing', async () => {
    const app = supertest(system.app)
    const name = randomName()
    const postBody = randomThingBody({ name })
    const request = app.post('/things').send(postBody)

    const response = await request

    const resource = Resource.fromJson(response.body)
    const id = resource.getProperty('id')
    expect(response.statusCode).toBe(201)
    expect(id).toBeUuid()
    expect(resource).toContainHref('self', `${request.url}/${id}`)
    expect(resource.getProperty('name')).toEqual(name)
  })

  test('does not create thing when properties are missing', async () => {
    const app = supertest(system.app)
    const request = app.post('/things').send({})

    const response = await request

    const resource = Resource.fromJson(response.body)
    expect(response.statusCode).toBe(422)
    expect(resource).toContainHrefMatching('self', /\/things$/)
    expect(resource.getProperty('errorDetails')).toStrictEqual([
      {
        context: { key: 'name', label: 'name' },
        message: '"name" is required',
        path: ['name'],
        type: 'any.required'
      }
    ])
  })
})
