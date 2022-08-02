import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Database } from '../shared/database'
import { allEvents } from './queries'
import { Event } from './event'
import { linkFor, Route } from '../links'

const buildSelf = ({ protocol, headers, url }: Request) =>
  `${protocol}://${headers['host']}${url}`

const eventToResource = (request: Request, event: Event) =>
  Resource.create()
    .addLinks({
      self: linkFor(request, Route.Event, { eventId: event.id }),
      thing: linkFor(request, Route.Thing, { thingId: event.streamId })
    })
    .addProperties({
      id: event.id,
      type: event.type,
      occurredAt: event.occurredAt,
      observedAt: event.observedAt
    })

export const createEventsRoutes = (
  app: Express,
  dependencies: { database: Database }
) => {
  const { database } = dependencies

  app.route('/events').get(async (request: Request, response: Response) => {
    const events = await allEvents(database)
    const eventResources = events.map((event) =>
      eventToResource(request, event)
    )

    const resource = Resource.create()
      .addLink('self', buildSelf(request))
      .addResource('events', eventResources)
      .toJson()
    return response.json(resource)
  })
}
