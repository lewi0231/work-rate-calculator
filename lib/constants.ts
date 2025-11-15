import { DayOfWeek } from "./scheduler";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const AVAILABILITY_HEADINGS = [
  ...DAYS_OF_WEEK.map((day) => day.substring(0, 3)),
  "not region",
  "under perform",
] as const;

export const CAR_YARD_HEADINGS = [
  "yard id",
  "per week",
  "no. days gap",
  "region",
  "min workers",
  "max workers",
  "length in hours",
  "start time",
  "linked yard",
  "no. days gap",
  "required days",
];
