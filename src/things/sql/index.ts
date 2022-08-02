import fs from 'fs'

export const thingByIdStatement = fs.readFileSync(
  './src/things/sql/thingById.sql',
  'utf8'
)
