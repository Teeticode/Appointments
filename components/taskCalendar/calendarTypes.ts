// calendarEmitter.ts
import mitt from "mitt";
import { CalendarDayMetadata } from "@marceloterreiro/flash-calendar";

export const setDayEmitter = mitt<{
  daySelected: CalendarDayMetadata;
}>();

export const today = new Date();
