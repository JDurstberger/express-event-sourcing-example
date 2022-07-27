import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { v4 as uuid } from 'uuid'
import { addEvent, AddEvent } from '../events'
import moment from 'moment'
import { Database } from '../shared/database'

const buildSelf = ({ protocol, headers, url }: Request, id: string) =>
  `${protocol}://${headers['host']}${url}/${id}`

const createThingEvent = (): AddEvent => {
  const eventId = uuid()
  const thingId = uuid()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {},
    type: 'thing-created',
    streamType: 'thing',
    streamId: thingId,
  }
}

export const createThingResource = (
  app: Express,
  dependencies: { database: Database },
) => {
  const { database } = dependencies

  app.route('/things').post(async (request: Request, response: Response) => {
    const event = createThingEvent()
    await addEvent(database, event)

    const resource = Resource.create()
      .addProperty('id', event.streamId)
      .addLink('self', buildSelf(request, event.streamId))

    return response.status(201).json(resource.toJson())
  })
}
