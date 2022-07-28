import { Moment } from 'moment'

export type Event = {
  id: string
  observedAt: Moment
  occurredAt: Moment
  type: string
  streamId: string
  streamType: string
  payload: {
    [key: string]: any
  }
}
