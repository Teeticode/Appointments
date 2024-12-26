import mitt from "mitt";
import { CalendarDayMetadata } from "@marceloterreiro/flash-calendar";

export const calendarEvents = mitt<{
  daySelected: CalendarDayMetadata;
}>();
