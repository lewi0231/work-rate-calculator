export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type EmployeeReliabilityRating =
  | "excellent"
  | "acceptable"
  | "below_average";
export type CarYardPriority = "high" | "medium" | "low";
export type CarYardRegion = "north" | "central" | "south";

export interface Employee {
  id: number;
  name: string;
  ranking: EmployeeReliabilityRating;
  available_days: DayOfWeek[];
  not_region?: CarYardRegion;
}

export interface CarYard {
  id: number;
  name: string;
  priority: CarYardPriority;
  region: CarYardRegion;
  min_employees: number;
  max_employees: number;
  hours_required: number;
  required_days?: DayOfWeek[];
  per_week?: [visitsRequired: number, minGapDays: number];
  linked_yard?: [otherYardId: number, gapDays: number];
  startTime?: string; // "HH:MM"
}

export interface ScheduleRequestPayload {
  employees: Employee[];
  car_yards: CarYard[];
  days: DayOfWeek[];
  yard_groups?: Record<string, number[]>;
  max_hours_per_day?: number;
  earliest_start_time?: string; // "HH:MM"
  travel_buffer_minutes?: number;
}

// Response types from the roster API
export interface Assignment {
  employee_id: number;
  employee_name: string;
  car_yard_id: number;
  car_yard_name: string;
  day: DayOfWeek;
  start_time: string;
  finish_time: string;
}

export interface YardSchedule {
  car_yard_id: number;
  car_yard_name: string;
  workers: string[];
  start_time: string;
  finish_time: string;
}

export interface DayRoster {
  day: DayOfWeek;
  yards: YardSchedule[];
}

export interface RosterStructure {
  days: DayRoster[];
}

export interface YardTimeblock {
  /** Timeblock for a yard on a specific day with employee assignments */
  car_yard_id: number;
  car_yard_name: string;
  day: string; // Day of week as string (e.g., "monday")
  start_time: string; // ISO format time (e.g., "06:00")
  finish_time: string; // ISO format time (e.g., "14:00")
  employees: number[]; // List of employee IDs
  minutes_per_employee: number;
  per_employee_hours: number;
}

export interface ScheduleStats {
  /** Statistics about the generated schedule */
  total_assignments: number;
  shifts_per_employee: Record<number, number>; // employee_id -> number of shifts
  // "yard_{cy_id}_day_{day.value}" -> number of employees
  yards_covered: Record<string, number>;
  // "emp_{emp_id}_day_{day.value}" -> hours worked
  hours_per_employee_day: Record<string, number>;
  yard_timeblocks: YardTimeblock[];
  solve_time_seconds: number;
}

export interface ScheduleResponse {
  status: string;
  assignments?: Assignment[];
  roster: RosterStructure;
  stats?: ScheduleStats;
}

export const payload: ScheduleRequestPayload = {
  employees: [
    {
      id: 1,
      name: "Chris",
      ranking: "excellent",
      available_days: ["monday", "wednesday", "thursday", "friday", "saturday"],
    },
    {
      id: 2,
      name: "Vashaal",
      ranking: "excellent",
      available_days: ["monday", "tuesday", "thursday", "friday"],
    },
    {
      id: 3,
      name: "Paul",
      ranking: "excellent",
      available_days: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      not_region: "south",
    },
    {
      id: 4,
      name: "Nitish",
      ranking: "excellent",
      available_days: [
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
    },
    {
      id: 5,
      name: "Sanskar",
      ranking: "excellent",
      available_days: ["monday", "tuesday", "thursday", "friday"],
    },
    {
      id: 6,
      name: "Sam",
      ranking: "below_average",
      available_days: ["tuesday", "thursday", "friday"],
    },
  ],
  car_yards: [
    {
      id: 1,
      name: "Adrien Brian",
      priority: "high",
      region: "central",
      min_employees: 2,
      max_employees: 4,
      hours_required: 8.0,
      per_week: [2, 2],
    },
    {
      id: 2,
      name: "Reynella Kia",
      priority: "high",
      region: "south",
      min_employees: 2,
      max_employees: 4,
      hours_required: 6.0,
      linked_yard: [3, 1],
      per_week: [1, 0],
    },
    {
      id: 3,
      name: "Reynella All",
      priority: "high",
      region: "south",
      min_employees: 3,
      max_employees: 4,
      hours_required: 12.0,
      per_week: [1, 0],
    },
    {
      id: 4,
      name: "EasyAuto123 Tender",
      priority: "high",
      region: "central",
      min_employees: 2,
      max_employees: 4,
      hours_required: 8.0,
      required_days: ["monday"],
      startTime: "08:30:00",
      per_week: [1, 0],
    },
    {
      id: 5,
      name: "EasyAuto123 Warehouse",
      priority: "high",
      region: "central",
      min_employees: 2,
      max_employees: 3,
      hours_required: 3.5,
      required_days: ["friday"],
      startTime: "08:30:00",
      per_week: [1, 0],
    },
    {
      id: 6,
      name: "Hillcrest New/Used",
      priority: "high",
      region: "north",
      min_employees: 2,
      max_employees: 3,
      hours_required: 7,
      required_days: ["thursday"],
      per_week: [1, 0],
    },
    {
      id: 7,
      name: "Eblen Suburu",
      priority: "high",
      region: "central",
      min_employees: 1,
      max_employees: 2,
      hours_required: 3.5,
      per_week: [2, 2],
    },
    {
      id: 8,
      name: "Stillwell Ford",
      priority: "high",
      region: "central",
      min_employees: 1,
      max_employees: 1,
      hours_required: 2,
      per_week: [1, 0],
    },
    {
      id: 9,
      name: "Main North Toyota",
      priority: "high",
      region: "north",
      min_employees: 2,
      max_employees: 3,
      hours_required: 6,
      required_days: ["friday"],
      per_week: [1, 0],
    },
    {
      id: 10,
      name: "MG Reynella",
      priority: "high",
      region: "south",
      min_employees: 1,
      max_employees: 2,
      hours_required: 5,
      required_days: ["thursday"],
      per_week: [1, 0],
    },
  ],
  days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  // yard_groups: {
  //   reynella_group: [5, 6],
  // },
  max_hours_per_day: 6.0,
  earliest_start_time: "06:00:00",
  travel_buffer_minutes: 30,
};
