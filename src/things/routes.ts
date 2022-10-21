import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'
import { Database } from '../shared/database'
import { findThingById } from './queries'
import { Thing } from './thing'
import { createThing, deleteThing, updateThing } from './commands'
import { linkFor, Route } from '../links'
import { validateCreateThing } from './validations'
import { ValidationError } from 'joi'

const validationErrorToResource = (
  request: Request,
  validationError: ValidationError
) =>
  Resource.create()
    .addLink('self', linkFor(request, Route.Things))
    .addProperty('errorDetails', validationError.details)

const thingToResource = (request: Request, thing: Thing) =>
  Resource.create()
    .addLink('self', linkFor(request, Route.Thing, { thingId: thing.id }))
    .addProperty('id', thing.id)
    .addProperty('name', thing.name)

export const createThingRoutes = (
  app: Express,
  dependencies: { database: Database }
) => {
  const { database } = dependencies

  app.route('/things').post(async (request: Request, response: Response) => {
    const validationResult = validateCreateThing(request)

    if (validationResult.error) {
      return response
        .status(422)
        .json(
          validationErrorToResource(request, validationResult.error).toJson()
        )
    }

    const thing = await createThing(dependencies, validationResult.value)

    return response.status(201).json(thingToResource(request, thing).toJson())
  })

  app
    .route('/things/:thingId')
    .put(async (request: Request, response: Response) => {
      let thing = await findThingById(database, request.params.thingId)
      if (thing === null)
        return response
          .status(404)
          .json(
            Resource.create()
              .addProperty('error', 'resource not found')
              .toJson()
          )

      const validationResult = validateCreateThing(request)
      if (validationResult.error) {
        return response
          .status(422)
          .json(
            validationErrorToResource(request, validationResult.error).toJson()
          )
      }

      thing = await updateThing(dependencies, thing.id, validationResult.value)
      return response.status(200).json(thingToResource(request, thing).toJson())
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

  app
    .route('/things/:thingId')
    .delete(async (request: Request, response: Response) => {
      const thing = await findThingById(database, request.params.thingId)

      if (thing === null)
        return response
          .status(404)
          .json(
            Resource.create()
              .addProperty('error', 'resource not found')
              .toJson()
          )

      await deleteThing(dependencies, thing)
      return response.status(200).send()
    })
}
