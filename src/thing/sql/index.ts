import fs from 'fs'

export const thingByIdStatement = fs.readFileSync(
  './src/thing/sql/thingById.sql',
  'utf8'
)
