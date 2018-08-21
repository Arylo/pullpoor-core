import { EventEmitter } from "events";

const event = new EventEmitter();

export const on = event.on;
export const once = event.once;
export const emit = event.emit;
