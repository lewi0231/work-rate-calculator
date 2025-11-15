"use server";

import { EmployeeReliabilityRating, ScheduleRequestPayload } from "./scheduler";

// Mapping from frontend string values to server integer enum values
const RELIABILITY_RATING_MAP: Record<EmployeeReliabilityRating, number> = {
  excellent: 10,
  acceptable: 7,
  below_average: 5,
} as const;

// Transform time string "HH:MM" or "HH:MM:SS" to time object { hours, minutes }
function transformTimeString(
  timeString: string | undefined
): { hours: number; minutes: number } | undefined {
  if (!timeString) return undefined;

  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
}

// Transform the payload to match server API expectations
function transformPayloadForServer(payload: ScheduleRequestPayload) {
  return {
    ...payload,
    employees: payload.employees.map((employee) => ({
      ...employee,
      ranking: RELIABILITY_RATING_MAP[employee.ranking],
    })),
    earliest_start_time: payload.earliest_start_time,
    car_yards: payload.car_yards.map((yard) => ({
      ...yard,
      startTime: yard.startTime,
    })),
  };
}

export async function generateRoster(payload: ScheduleRequestPayload) {
  try {
    // Transform the payload before sending to match server expectations
    const transformedPayload = transformPayloadForServer(payload);

    const response = await fetch(
      `${process.env.BASE_SCHEDULER_URL}${process.env.ROSTER_ENDPOINT}`,
      {
        body: JSON.stringify(transformedPayload),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(
        `Failed to generate roster: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating roster:", error);
    throw error;
  }
}
