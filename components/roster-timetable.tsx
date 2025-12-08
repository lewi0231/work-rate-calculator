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
import { GripVertical, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type RosterTimetableProps = {
  days: DayRoster[];
  employees: Employee[];
  onRemoveWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onAddWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onMoveShift?: (
    yard: YardSchedule,
    fromDay: DayOfWeek,
    toDay: DayOfWeek,
    targetIndex?: number
  ) => void;
};

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
 * - Draggable handle icon
 * - List of assigned workers as interactive badges (can be removed)
 * - Add worker dropdown
 */
function YardCard({
  yard,
  day,
  employees,
  onRemoveWorker,
  onAddWorker,
  onMoveShift,
}: {
  yard: YardSchedule;
  day: DayOfWeek;
  employees: Employee[];
  onRemoveWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onAddWorker: (day: DayOfWeek, yardId: number, workerName: string) => void;
  onMoveShift?: (
    yard: YardSchedule,
    fromDay: DayOfWeek,
    toDay: DayOfWeek
  ) => void;
}) {
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ yard, fromDay: day })
    );
    // Browser will automatically create a drag image from the element
    // No need to manually set drag image - it can cause issues with React components
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      className={cn(
        "mb-3 border bg-gray-200/50 shadow-sm hover:shadow transition-shadow cursor-move",
        isDragging && "opacity-50"
      )}
      draggable={!!onMoveShift}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight flex-1">
            {yard.car_yard_name}
          </CardTitle>
          {onMoveShift && (
            <div
              className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0 pb-3">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWorker(day, yard.car_yard_id, worker);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingWorker(true);
                  }}
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
 * DropZone component for inserting items at specific positions
 * Shows a visual indicator when active (being dragged over)
 */
function DropZone({
  onDrop,
  onDragOver,
  isActive,
}: {
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "h-2 w-full transition-all duration-150 cursor-pointer",
        isActive && "h-8"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {isActive && (
        <div className="h-1.5 w-full bg-primary rounded-full mt-3 shadow-lg" />
      )}
    </div>
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
  onMoveShift,
}: RosterTimetableProps) {
  // Simplified state management with single object
  const [dragState, setDragState] = useState<{
    day: DayOfWeek | null;
    index: number | null;
  }>({ day: null, index: null });

  // Set up global drag end listener to clean up state
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setDragState({ day: null, index: null });
    };

    document.addEventListener("dragend", handleGlobalDragEnd);
    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd);
    };
  }, []);

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

  const handleDragOver = (
    e: React.DragEvent,
    day: DayOfWeek,
    index?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragState({ day, index: index ?? null });
  };

  const handleDrop = (
    e: React.DragEvent,
    toDay: DayOfWeek,
    targetIndex?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ day: null, index: null });

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json")) as {
        yard: YardSchedule;
        fromDay: DayOfWeek;
      };

      if (data.yard && data.fromDay && onMoveShift) {
        onMoveShift(data.yard, data.fromDay, toDay, targetIndex);
      }
    } catch (error) {
      console.warn("Failed to parse drag data:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6 ">
        {orderedDays.map(({ day, yards }) => (
          <div key={day} className="flex min-h-0 flex-col" data-column={day}>
            {/* Day Header */}
            <div className="mb-3 rounded-md px-3 py-2 text-center sticky top-0 z-10 bg-background/80 backdrop-blur-2xl">
              <h3 className="font-semibold text-foreground">
                {capitalizeDay(day)}
              </h3>
            </div>

            {/* Yard Cards for this day - Drop Zone */}
            <div
              className="flex-1 space-y-0 overflow-y-auto min-h-[200px] rounded-md"
              onDragOver={(e) => {
                // Column-level drag over handler to ensure drops work properly
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {yards.length > 0 ? (
                <>
                  {/* Drop zone at the beginning */}
                  <DropZone
                    onDragOver={(e) => handleDragOver(e, day as DayOfWeek, 0)}
                    onDrop={(e) => handleDrop(e, day as DayOfWeek, 0)}
                    isActive={dragState.day === day && dragState.index === 0}
                  />
                  {yards.map((yard, index) => (
                    <div key={yard.car_yard_id}>
                      <YardCard
                        yard={yard}
                        day={day as DayOfWeek}
                        employees={employees}
                        onRemoveWorker={onRemoveWorker}
                        onAddWorker={onAddWorker}
                        onMoveShift={onMoveShift}
                      />
                      {/* Drop zone after each card */}
                      <DropZone
                        onDragOver={(e) =>
                          handleDragOver(e, day as DayOfWeek, index + 1)
                        }
                        onDrop={(e) =>
                          handleDrop(e, day as DayOfWeek, index + 1)
                        }
                        isActive={
                          dragState.day === day && dragState.index === index + 1
                        }
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div
                  className={cn(
                    "rounded-md border border-dashed min-h-[100px] flex items-center justify-center text-center text-sm text-muted-foreground transition-colors",
                    dragState.day === day && "border-primary bg-primary/5"
                  )}
                  onDragOver={(e) => handleDragOver(e, day as DayOfWeek, 0)}
                  onDrop={(e) => handleDrop(e, day as DayOfWeek, 0)}
                >
                  {dragState.day === day ? "Drop here" : "No yards scheduled"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
