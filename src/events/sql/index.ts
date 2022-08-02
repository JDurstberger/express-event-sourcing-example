import fs from 'fs'

export const allEventsStatement = fs.readFileSync(
  './src/events/sql/allEvents.sql',
  'utf8'
)

export const allEventsForStreamStatement = fs.readFileSync(
  './src/events/sql/allEventsForStreamId.sql',
  'utf8'
)

export const insertEventStatement = fs.readFileSync(
  './src/events/sql/insertEvent.sql',
  'utf8'
)

export const eventByIdStatement = fs.readFileSync(
  './src/events/sql/eventById.sql',
  'utf8'
)
