import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { Assignment, DayOfWeek, ScheduleStats } from "@/lib/scheduler";

type RosterEmployeeViewProps = {
  assignments: Assignment[];
  stats?: ScheduleStats;
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
 * AssignmentCard component displays a single assignment
 * Shows yard name and time range
 */
function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="rounded-md border bg-card/50 p-2.5 shadow-sm hover:bg-card hover:shadow transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold leading-tight text-foreground truncate">
            {assignment.car_yard_name}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            {formatTime(assignment.start_time)} -{" "}
            {formatTime(assignment.finish_time)}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculates total hours for an employee from stats
 */
function calculateTotalHours(
  employeeId: number,
  stats?: ScheduleStats
): number | null {
  if (!stats?.hours_per_employee_day) return null;

  const prefix = `emp_${employeeId}_day_`;
  let total = 0;

  for (const [key, hours] of Object.entries(stats.hours_per_employee_day)) {
    if (key.startsWith(prefix)) {
      total += hours;
    }
  }

  return total > 0 ? total : null;
}

/**
 * EmployeeScheduleCard displays all assignments for a single employee
 */
function EmployeeScheduleCard({
  employeeName,
  employeeId,
  assignments,
  stats,
}: {
  employeeName: string;
  employeeId: number;
  assignments: Assignment[];
  stats?: ScheduleStats;
}) {
  // Group assignments by day
  const assignmentsByDay = new Map<DayOfWeek, Assignment[]>();
  assignments.forEach((assignment) => {
    const dayAssignments = assignmentsByDay.get(assignment.day) || [];
    dayAssignments.push(assignment);
    assignmentsByDay.set(assignment.day, dayAssignments);
  });

  // Create ordered days with assignments, filtering out days with no assignments
  const orderedDays = DAYS_OF_WEEK.map((day) => ({
    day,
    assignments: assignmentsByDay.get(day) || [],
  })).filter(({ assignments }) => assignments.length > 0);

  // Calculate total assignments for summary
  const totalAssignments = assignments.length;
  const totalHours = calculateTotalHours(employeeId, stats);

  return (
    <Card className="mb-4 border shadow-sm hover:shadow-md transition-shadow bg-gray-200/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {employeeName}
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            {totalHours !== null && (
              <span className="text-sm font-semibold text-foreground">
                ~{totalHours.toFixed(1)}h
              </span>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {totalAssignments}{" "}
              {totalAssignments === 1 ? "assignment" : "assignments"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {orderedDays.length > 0 ? (
          orderedDays.map(({ day, assignments: dayAssignments }) => (
            <div key={day} className="space-y-2 ">
              {/* Day Header */}
              <div className="flex items-center gap-2 ">
                <h4 className="text-sm font-semibold text-foreground">
                  {capitalizeDay(day)}
                </h4>
                <span className="text-xs font-medium text-muted-foreground">
                  ({dayAssignments.length}{" "}
                  {dayAssignments.length === 1 ? "assignment" : "assignments"})
                </span>
              </div>

              {/* Assignments for this day */}
              <div className="space-y-1.5">
                {dayAssignments.map((assignment, index) => (
                  <AssignmentCard
                    key={`${assignment.car_yard_id}-${assignment.day}-${index}`}
                    assignment={assignment}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            No assignments scheduled
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * RosterEmployeeView displays the roster organized by employee
 * showing each employee's schedule across all days
 */
export function RosterEmployeeView({
  assignments,
  stats,
}: RosterEmployeeViewProps) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        No assignments available.
      </div>
    );
  }

  // Group assignments by employee
  const assignmentsByEmployee = new Map<
    number,
    { name: string; assignments: Assignment[] }
  >();

  assignments.forEach((assignment) => {
    const existing = assignmentsByEmployee.get(assignment.employee_id);
    if (existing) {
      existing.assignments.push(assignment);
    } else {
      assignmentsByEmployee.set(assignment.employee_id, {
        name: assignment.employee_name,
        assignments: [assignment],
      });
    }
  });

  // Sort employees by name for consistent display
  const employees = Array.from(assignmentsByEmployee.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map(({ id, name, assignments: employeeAssignments }) => (
          <EmployeeScheduleCard
            key={id}
            employeeId={id}
            employeeName={name}
            assignments={employeeAssignments}
            stats={stats}
          />
        ))}
      </div>
    </div>
  );
}
