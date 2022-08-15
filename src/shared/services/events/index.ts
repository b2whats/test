import { EventEmitter } from '../../utils/EventEmitter'

type AppEvents = {

}

export const events = new EventEmitter<AppEvents>()
