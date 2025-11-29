import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { DayOfWeek, DayRoster, Employee, YardSchedule } from "@/lib/scheduler";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type RosterTimetableProps = {
  days: DayRoster[];
  employees: Employee[];
  onRemoveWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onAddWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
};

/**
 * Formats a time string (HH:MM:SS or HH:MM) to a readable format (HH:MM)
 */
function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":").slice(0, 2);
  return `${hours}:${minutes}`;
}

/**
 * Capitalizes the first letter of a day name for display
 */
function capitalizeDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * YardCard component displays a single yard's schedule information
 *
 * Displays:
 * - Yard name (title)
 * - Time range (start - finish)
 * - List of assigned workers as interactive badges (can be removed)
 * - Add worker dropdown
 */
function YardCard({
  yard,
  day,
  employees,
  onRemoveWorker,
  onAddWorker,
}: {
  yard: YardSchedule;
  day: DayOfWeek;
  employees: Employee[];
  onRemoveWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onAddWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
}) {
  const [isAddingWorker, setIsAddingWorker] = useState(false);

  // Get available employees (not already assigned to this yard)
  const availableEmployees = employees.filter(
    (emp) => !yard.workers.includes(emp.name)
  );

  const handleAddWorker = (workerName: string) => {
    if (workerName === "none") {
      setIsAddingWorker(false);
      return;
    }
    if (workerName) {
      onAddWorker(day, yard.car_yard_id, workerName);
      setIsAddingWorker(false);
    }
  };

  return (
    <Card className="mb-3 border bg-gray-200/50 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm font-semibold leading-tight">
          {yard.car_yard_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0 pb-3">
        {/* Time Range */}
        <div className="flex items-center gap-1 text-xs font-medium text-foreground">
          <span className="text-muted-foreground">Time:</span>
          <span>
            {formatTime(yard.start_time)} - {formatTime(yard.finish_time)}
          </span>
        </div>

        {/* Workers List */}
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">
            Workers ({yard.workers.length}):
          </div>
          <div className="flex flex-wrap gap-1">
            {yard.workers.map((worker, index) => (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-primary/20"
                )}
              >
                {worker}
                <button
                  onClick={() => onRemoveWorker(day, yard.car_yard_id, worker)}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${worker} from ${yard.car_yard_name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Worker Dropdown */}
          {availableEmployees.length > 0 && (
            <div className="mt-2">
              {!isAddingWorker ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setIsAddingWorker(true)}
                >
                  <Plus className="h-3 w-3" />
                  Add Worker
                </Button>
              ) : (
                <Select onValueChange={handleAddWorker}>
                  <SelectTrigger className="h-7 text-xs w-full">
                    <SelectValue placeholder="Select worker..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Cancel</SelectItem>
                    {availableEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.name}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * RosterTimetable displays the weekly roster in a grid layout
 * with days as columns and yard schedules as cards within each day
 */
export function RosterTimetable({
  days,
  employees,
  onRemoveWorker,
  onAddWorker,
}: RosterTimetableProps) {
  // Create a map of day -> yards for efficient lookup
  const dayMap = new Map<string, YardSchedule[]>();
  days.forEach((dayRoster) => {
    dayMap.set(dayRoster.day, dayRoster.yards);
  });

  // Ensure we have data for all days in the correct order
  const orderedDays = DAYS_OF_WEEK.map((day) => ({
    day,
    yards: dayMap.get(day) || [],
  }));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6 ">
        {orderedDays.map(({ day, yards }) => (
          <div key={day} className="flex min-h-0 flex-col">
            {/* Day Header */}
            <div className="mb-3 rounded-md px-3 py-2 text-center sticky top-0 z-10 bg-background/80 backdrop-blur-2xl">
              <h3 className="font-semibold text-foreground">
                {capitalizeDay(day)}
              </h3>
            </div>

            {/* Yard Cards for this day */}
            <div className="flex-1 space-y-0 overflow-y-auto ">
              {yards.length > 0 ? (
                yards.map((yard) => (
                  <YardCard
                    key={yard.car_yard_id}
                    yard={yard}
                    day={day as DayOfWeek}
                    employees={employees}
                    onRemoveWorker={onRemoveWorker}
                    onAddWorker={onAddWorker}
                  />
                ))
              ) : (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No yards scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
