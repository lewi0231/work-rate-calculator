import { RosterEmployeeView } from "@/components/roster-employee-view";
import { RosterTimetable } from "@/components/roster-timetable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleResponse } from "@/lib/scheduler";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  isOpen: boolean;
  onOpenChange: (newState: boolean) => void;
  rosterData: ScheduleResponse | null;
};

export function RosterDisplaySheet({
  isOpen,
  onOpenChange,
  rosterData,
}: Props) {
  const hasRosterData = rosterData?.roster && rosterData.roster.days.length > 0;
  const hasAssignments =
    rosterData?.assignments && rosterData.assignments.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="!w-[90vw] !max-w-7xl sm:!w-[95vw] sm:!max-w-7xl flex flex-col px-4 ">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Weekly Roster</SheetTitle>
          <SheetDescription>
            View the scheduled assignments by day or by employee.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex-1 min-h-0 flex flex-col">
          {hasRosterData || hasAssignments ? (
            <Tabs
              defaultValue="by-day"
              className="flex flex-1 flex-col min-h-0"
            >
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="by-day" className="flex-1 cursor-pointer">
                  By Day
                </TabsTrigger>
                <TabsTrigger
                  value="by-employee"
                  className="flex-1 cursor-pointer"
                >
                  By Employee
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="by-day"
                className="flex-1 min-h-0 overflow-y-auto border-2 border-foreground/10 rounded-md px-4"
              >
                {hasRosterData ? (
                  <RosterTimetable days={rosterData.roster.days} />
                ) : (
                  <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                    No roster data available.
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="by-employee"
                className="flex-1 min-h-0 overflow-y-auto"
              >
                {hasAssignments ? (
                  <RosterEmployeeView
                    assignments={rosterData.assignments!}
                    stats={rosterData.stats}
                  />
                ) : (
                  <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                    No assignment data available.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
              No roster data available. Generate a roster to view the schedule.
            </div>
          )}
        </div>
        <Button
          variant="default"
          className="my-4 text-lg w-1/4 h-20 mx-auto cursor-pointer hover:scale-110 transition-transform duration-300"
          disabled
        >
          <Download />
          <span>Export Roster</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
