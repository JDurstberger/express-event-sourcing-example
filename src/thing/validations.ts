import { Request } from 'express'
import Joi from 'joi'

const createThingPostBodySchema = Joi.object({
  name: Joi.string().required()
})

export const validateCreateThing = (request: Request) =>
  createThingPostBodySchema.validate(request.body)
