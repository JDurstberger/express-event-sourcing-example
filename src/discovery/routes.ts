import { Express, Request, Response } from 'express'
import { Resource } from '../shared/hal'

const buildSelf = (request: Request) =>
  request.protocol + '://' + request.headers['host'] + request.url

export const createDiscoveryRoutes = (app: Express) => {
  app.route('/').get((request: Request, response: Response) => {
    const resource = Resource.create()
      .addLink('self', buildSelf(request))
      .toJson()
    return response.json(resource)
  })
}
