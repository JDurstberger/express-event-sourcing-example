import express, {Request} from 'express';

const app = express()

const buildSelf = (request: Request) =>
  request.protocol+"://"+request.headers['host'] + request.url

app.get(
  '/',
  (request: Request, response) => {
    return response.json({_links: {self: {href: buildSelf(request)}}})
  }
)

export {
  app
}
