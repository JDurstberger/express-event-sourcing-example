import faker from 'faker'
import { randomUUID } from 'crypto'
import moment from 'moment'

export const randomName = () => faker.name.findName()

export const randomCreateThingBody = (overrides: { name?: string } = {}) => ({
  name: randomName(),
  ...overrides
})

export const randomEvent = (overrides: { id?: string } = {}) => ({
  id: randomUUID(),
  observedAt: moment.utc(),
  occurredAt: moment.utc(),
  payload: {},
  type: 'foo-created',
  streamType: 'foo',
  streamId: randomUUID(),
  ...overrides
})
