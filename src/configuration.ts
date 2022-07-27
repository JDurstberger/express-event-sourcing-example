import dotenv from 'dotenv'

dotenv.config()

export type DatabaseConfiguration = {
  host: string
  port: number
  name: string
  user: string
  password: string
}

export type Configuration = {
  service: {
    port: number
  }
  database: DatabaseConfiguration
}

const getEnvString = (key: string): string => {
  const value = process.env[key]

  if (!value) throw Error(`Unable to load env variable ${key}`)

  return value
}

const getEnvInt = (key: string): number => {
  const value = process.env[key]

  if (!value) throw Error(`Unable to load env variable ${key}`)

  return Number.parseInt(value)
}

export const loadConfiguration = (): Configuration => {
  return {
    service: {
      port: getEnvInt('EESE_SERVICE_SERVICE_PORT'),
    },
    database: {
      host: getEnvString('EESE_SERVICE_DATABASE_HOST'),
      port: getEnvInt('EESE_SERVICE_DATABASE_PORT'),
      name: getEnvString('EESE_SERVICE_DATABASE_NAME'),
      user: getEnvString('EESE_SERVICE_DATABASE_USER'),
      password: getEnvString('EESE_SERVICE_DATABASE_PASSWORD'),
    },
  }
}
