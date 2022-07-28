import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { v4 as uuid } from 'uuid'
import { addEvent, AddEvent } from '../events'
import moment from 'moment'
import { Database } from '../shared/database'
import { getThingById } from './queries'
import { Thing } from './thing'
import { project } from './projection'

const buildSelf = ({ protocol, headers, url }: Request, id: string) =>
  `${protocol}://${headers['host']}${url}/${id}`

type ThingCreatedPayload = {
  name: string
}

const createThingEvent = (): AddEvent<ThingCreatedPayload> => {
  const eventId = uuid()
  const thingId = uuid()
  const now = moment.utc()
  return {
    id: eventId,
    observedAt: now,
    occurredAt: now,
    payload: {
      name: 'Frederick', //TODO replace with posted name
    },
    type: 'thing-created',
    streamType: 'thing',
    streamId: thingId,
  }
}

const thingToResource = (thing: Thing) =>
  Resource.create().addProperty('id', thing.id)

export const createThingResource = (
  app: Express,
  dependencies: { database: Database },
) => {
  const { database } = dependencies

  app.route('/things').post(async (request: Request, response: Response) => {
    const event = createThingEvent()

    await database.withTransaction(async (database) => {
      await addEvent(database, event)
      await project(database, event.streamId)
    })

    const resource = Resource.create()
      .addProperty('id', event.streamId)
      .addLink('self', buildSelf(request, event.streamId))

    return response.status(201).json(resource.toJson())
  })

  app
    .route('/things/:thingId')
    .get(async (request: Request, response: Response) => {
      const thing = await getThingById(database, request.params.thingId)
      if (thing)
        return response.status(200).json(thingToResource(thing).toJson())
      else
        return response
          .status(404)
          .json(
            Resource.create()
              .addProperty('error', 'resource not found')
              .toJson(),
          )
    })
}
