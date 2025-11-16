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
import { useState } from "react";

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
      const response = await generateRoster(data);
      console.log(response);
      setRosterData(response as ScheduleResponse);
      setRosterDisplayIsOpen(true);
    } catch (error) {
      console.error("Failed to generate roster:", error);
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

  return (
    <main className="w-full min-h-screen flex flex-col justify-start items-start max-w-[1200px] mx-auto pb-12 space-y-10">
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

      <div className="w-full flex justify-center pt-4">
        <Button
          size="lg"
          className="min-w-[200px] h-12 px-8 text-lg font-semibold cursor-pointer"
          onClick={handleGenerateRoster}
          disabled={isLoading}
        >
          Generate Roster
        </Button>
      </div>
      <RosterDisplaySheet
        isOpen={rosterDisplayIsOpen}
        onOpenChange={(newState) => setRosterDisplayIsOpen(newState)}
        rosterData={rosterData}
      />
    </main>
  );
};

export default SchedulerPage;
