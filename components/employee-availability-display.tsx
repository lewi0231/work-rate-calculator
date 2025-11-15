import AddNameField from "@/components/add-name-field";
import Header from "@/components/header";
import SelectCarYardRegion from "@/components/select-region";
import { Checkbox } from "@/components/ui/checkbox";
import { AVAILABILITY_HEADINGS, DAYS_OF_WEEK } from "@/lib/constants";
import { ScheduleRequestPayload } from "@/lib/scheduler";
import { cn } from "@/lib/utils";

type EmployeeAvailabilityDisplayProps = {
  workers: ScheduleRequestPayload["employees"];
  onUpdateWorker: (
    workerId: number,
    updater: (
      worker: ScheduleRequestPayload["employees"][number]
    ) => ScheduleRequestPayload["employees"][number]
  ) => void;
  onAddWorker: (name: string) => void;
};

const EmployeeAvailabilityDisplay = ({
  workers,
  onUpdateWorker,
  onAddWorker,
}: EmployeeAvailabilityDisplayProps) => {
  const handleToggleAvailability = (
    workerId: number,
    day: (typeof DAYS_OF_WEEK)[number],
    checked: boolean
  ) => {
    onUpdateWorker(workerId, (current) => {
      if (checked) {
        const nextDays = Array.from(new Set([...current.available_days, day]));
        return {
          ...current,
          available_days: nextDays,
        };
      }

      return {
        ...current,
        available_days: current.available_days.filter((d) => d !== day),
      };
    });
  };

  return (
    <section className="w-full space-y-4 border-b pb-4">
      <Header
        subText="Please add or alter the default values as you like. Note that setting
        changes will be lost on page refresh."
      >
        Employee Availability
      </Header>
      <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(2rem,0.5fr))_repeat(2,minmax(4rem,1.5fr))]">
        <div className="border-r" />
        {AVAILABILITY_HEADINGS.map((heading, index) => (
          <div
            className={cn(
              " text-muted-foreground font-medium text-sm  w-full flex justify-center items-center py-4",
              [5, 6].includes(index) ? "border-r" : ""
            )}
            key={heading}
          >
            <span className=" text-center font-medium text-wrap">
              {heading.charAt(0).toUpperCase() + heading.substring(1)}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col divide-y">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="grid grid-cols-[minmax(12rem,1fr)_repeat(6,minmax(2rem,0.5fr))_repeat(2,minmax(4rem,1.5fr))] w-full py-4"
          >
            <div className="font-medium border-r">{worker.name}</div>
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={`${worker.id}-${day}`}
                className="w-full flex justify-center items-center "
              >
                <Checkbox
                  checked={worker.available_days.includes(day)}
                  onCheckedChange={(checked) =>
                    handleToggleAvailability(worker.id, day, Boolean(checked))
                  }
                  aria-label={`${worker.name} available on ${day}`}
                />
              </div>
            ))}
            <div className="flex items-center justify-center border-l overflow-hidden">
              <SelectCarYardRegion
                worker={worker}
                handleUpdateWorker={(region) =>
                  onUpdateWorker(worker.id, (current) => ({
                    ...current,
                    not_region: region,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-center border-l">
              <Checkbox
                checked={worker.ranking === "below_average"}
                onCheckedChange={(checked) =>
                  onUpdateWorker(worker.id, (current) => ({
                    ...current,
                    ranking: checked ? "below_average" : "excellent",
                  }))
                }
                aria-label={`${worker.name} marked as under performing`}
              />
            </div>
          </div>
        ))}
        <AddNameField handleAddWorker={onAddWorker} />
      </div>
    </section>
  );
};

export default EmployeeAvailabilityDisplay;
