import Header from "@/components/header";
import InputCounter from "@/components/input-counter";
import TimePicker from "@/components/ui/time-picker";

type GeneralSettingsDisplayProps = {
  maxHoursPerDay: number;
  earliestStartTime: string; // Format: "HH:MM"
  onMaxHoursPerDayChange: (value: number) => void;
  onEarliestStartTimeChange: (value: string) => void;
};

const GeneralSettingsDisplay = ({
  maxHoursPerDay,
  earliestStartTime,
  onMaxHoursPerDayChange,
  onEarliestStartTimeChange,
}: GeneralSettingsDisplayProps) => {
  return (
    <section className="w-full mx-auto border-b pb-4">
      <Header subText="Configure general scheduling parameters that apply across all employees and car yards.">
        General Settings
      </Header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 pb-4">
        <div className="flex flex-col gap-2 w-3/4">
          <label
            htmlFor="max-hours-per-day"
            className="text-sm font-medium text-muted-foreground"
          >
            Max Shift Length (hours)
          </label>
          <div className="flex items-center gap-2 bg-muted/50 py-3 px-3 rounded-md border-2 border-foreground/10">
            <InputCounter
              min={1}
              step={0.5}
              value={maxHoursPerDay}
              onValueChange={onMaxHoursPerDayChange}
              max={24}
              ariaLabel="Maximum hours per day"
              className="max-w-[8rem] border-2 border-foreground/10"
            />
            <span className="text-sm text-muted-foreground ">hours</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <TimePicker
            value={earliestStartTime}
            onChange={onEarliestStartTimeChange}
            label="Base Start Time"
            id="earliest-start-time"
            ariaLabel="Earliest start time for shifts"
            className="max-w-xs"
            labelClassName="text-muted-foreground"
            contentClassName="border-2 border-foreground/10"
            inputClassName="border-2 border-foreground/10"
          />
        </div>
      </div>
    </section>
  );
};

export default GeneralSettingsDisplay;
