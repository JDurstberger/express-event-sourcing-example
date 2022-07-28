import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Database } from '../shared/database'
import { findThingById } from './queries'
import { Thing } from './thing'
import { createThing } from './commands'

const buildSelf = ({ protocol, headers, url }: Request, id: string) =>
  `${protocol}://${headers['host']}${url}/${id}`

const thingToResource = (request: Request, thing: Thing) =>
  Resource.create()
    .addLink('self', buildSelf(request, thing.id))
    .addProperty('id', thing.id)

export const createThingResource = (
  app: Express,
  dependencies: { database: Database }
) => {
  const { database } = dependencies

  app.route('/things').post(async (request: Request, response: Response) => {
    const thing = await createThing(dependencies)

    return response.status(201).json(thingToResource(request, thing).toJson())
  })

  app
    .route('/things/:thingId')
    .get(async (request: Request, response: Response) => {
      const thing = await findThingById(database, request.params.thingId)
      if (thing)
        return response
          .status(200)
          .json(thingToResource(request, thing).toJson())
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
