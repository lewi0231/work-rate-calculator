import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatToTwoDecimals = (value: number): number => {
  return parseFloat(value.toFixed(2));
};

/**
 * Converts decimal hours to "hours:minutes" format (e.g., 2.5 -> "2:30")
 * @param decimalHours - The hours in decimal format (e.g., 2.5 for 2 hours 30 minutes)
 * @returns Formatted string in "hours:minutes" format
 */
export const formatDecimalHoursToTime = (decimalHours: number): string => {
  if (decimalHours <= 0) {
    return "00:00";
  }

  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const timeStringToMinutes = (timeValue: string) => {
  const [hours = "0", minutes = "0"] = timeValue.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

export function getShiftDurationHours(startTime: string, endTime: string) {
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);
  const totalMinutes = endMinutes - startMinutes;

  if (totalMinutes <= 0) {
    return { displayFormat: "00:00", decimalFormat: 0 };
  }

  const decimalValue = formatToTwoDecimals(totalMinutes / 60);
  const displayFormat = formatDecimalHoursToTime(decimalValue);

  return {
    displayFormat,
    decimalFormat: decimalValue,
  };
}
