import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Database } from '../shared/database'
import { allEvents, findEventById } from './queries'
import { eventToResource } from './mapping'

const buildSelf = ({ protocol, headers, url }: Request) =>
  `${protocol}://${headers['host']}${url}`

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

  app
    .route('/events/:eventId')
    .get(async (request: Request, response: Response) => {
      const event = await findEventById(database, request.params.eventId)

      if (event)
        return response
          .status(200)
          .json(eventToResource(request, event).toJson())
      else
        return response
          .status(404)
          .json(
            Resource.create()
              .addProperty('error', 'resource not found')
              .toJson()
          )
    })
}
