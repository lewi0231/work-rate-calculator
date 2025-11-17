"use client";

import CarYardCustomizationDisplay from "@/components/car-yard-customization-display";
import EmployeeAvailabilityDisplay from "@/components/employee-availability-display";
import GeneralSettingsDisplay from "@/components/general-settings-display";
import { RosterDisplaySheet } from "@/components/roster-display-sheet";
import { Button } from "@/components/ui/button";
import { generateRoster } from "@/lib/actions";
import { DAYS_OF_WEEK } from "@/lib/constants";
import {
  CarYard,
  Employee,
  payload,
  ScheduleRequestPayload,
  ScheduleResponse,
} from "@/lib/scheduler";
import { Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SchedulerPage = () => {
  const [workers, setWorkers] = useState<ScheduleRequestPayload["employees"]>(
    payload.employees
  );
  const [isLoading, setIsLoading] = useState(false);

  const [carYards, setCarYards] = useState(payload.car_yards);
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(
    payload.max_hours_per_day ?? 6.0
  );
  const [earliestStartTime, setEarliestStartTime] = useState(
    payload.earliest_start_time ?? "06:00:00"
  );
  const [rosterDisplayIsOpen, setRosterDisplayIsOpen] = useState(false);
  const [rosterData, setRosterData] = useState<ScheduleResponse | null>(null);

  const handleUpdateWorker = (
    workerId: number,
    updater: (
      worker: ScheduleRequestPayload["employees"][number]
    ) => ScheduleRequestPayload["employees"][number]
  ) => {
    setWorkers((prev) => {
      return prev.map((worker) => {
        return worker.id === workerId ? updater(worker) : worker;
      });
    });
  };

  const handleGenerateRoster = async () => {
    console.log(earliestStartTime);
    const data: ScheduleRequestPayload = {
      ...payload,
      employees: workers,
      car_yards: carYards,
      days: DAYS_OF_WEEK,
      earliest_start_time: earliestStartTime,
      max_hours_per_day: maxHoursPerDay,
    };

    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Generating roster...", {
        description: "This may take a few seconds",
      });

      const response = await generateRoster(data);
      console.log(response);
      setRosterData(response as ScheduleResponse);
      setRosterDisplayIsOpen(true);

      toast.dismiss(loadingToast);
      toast.success("Roster generated successfully!");
    } catch (error) {
      toast.dismiss();

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generated roster. Please try again or contact support.";
      console.error("Failed to generate roster:", error);

      toast.error("Failed to generate roster", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWorker = (workerId: number) => {
    setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
  };

  const handleAddWorker = (name: string) => {
    const newWorker: Employee = {
      name,
      id: workers.length + 1,
      available_days: DAYS_OF_WEEK,
      ranking: "below_average",
    };

    setWorkers((prev) => {
      return [...prev, newWorker];
    });
  };

  const handleRemoveCardYard = (yardId: number) => {
    setCarYards((prev) => prev.filter((yard) => yard.id !== yardId));
  };

  const handleAddCarYard = (name: string) => {
    const newCarYard: CarYard = {
      name,
      id: carYards.length + 1,
      min_employees: 1,
      max_employees: 4,
      region: "central",
      hours_required: 2,
      priority: "high",
    };
    setCarYards((prev) => {
      return [...prev, newCarYard];
    });
  };

  const handleUpdateCarYard = (
    yardId: number,
    updater: (
      yard: ScheduleRequestPayload["car_yards"][number]
    ) => ScheduleRequestPayload["car_yards"][number]
  ) => {
    setCarYards((prev) =>
      prev.map((yard) => (yard.id === yardId ? updater(yard) : yard))
    );
  };

  const hasRosterData = rosterData?.roster && rosterData.roster.days.length > 0;
  const hasAssignments =
    rosterData?.assignments && rosterData.assignments.length > 0;
  const canReopenRoster =
    (hasRosterData || hasAssignments) && !rosterDisplayIsOpen;

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-start max-w-[1200px] mx-auto pb-20 space-y-10 relative">
      <GeneralSettingsDisplay
        maxHoursPerDay={maxHoursPerDay}
        earliestStartTime={earliestStartTime}
        onMaxHoursPerDayChange={setMaxHoursPerDay}
        onEarliestStartTimeChange={setEarliestStartTime}
      />

      <EmployeeAvailabilityDisplay
        workers={workers}
        onUpdateWorker={handleUpdateWorker}
        onAddWorker={handleAddWorker}
        onRemoveWorker={handleRemoveWorker}
      />
      <CarYardCustomizationDisplay
        carYards={carYards}
        baseStartTime={earliestStartTime}
        onUpdateCarYard={handleUpdateCarYard}
        onAddCarYard={handleAddCarYard}
        numWorkers={workers.length}
        onRemoveCarYard={handleRemoveCardYard}
      />

      <div className="w-full flex justify-center">
        <Button
          size="lg"
          className="min-w-2/3 h-12 px-8 text-lg hover:animate-pulse font-semibold cursor-pointer"
          onClick={handleGenerateRoster}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Roster"
          )}
        </Button>
      </div>
      <RosterDisplaySheet
        isOpen={rosterDisplayIsOpen}
        onOpenChange={(newState) => setRosterDisplayIsOpen(newState)}
        rosterData={rosterData}
      />
      {canReopenRoster && (
        <Button
          onClick={() => setRosterDisplayIsOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 rounded-full shadow-lg h-14 w-14 p-0 hover:scale-110 transition-transform duration-200 cursor-pointer"
          size="icon"
          aria-label="View generated roster"
        >
          <Calendar className="h-6 w-6" />
          <span className="sr-only">View generated roster</span>
        </Button>
      )}
    </main>
  );
};

export default SchedulerPage;
