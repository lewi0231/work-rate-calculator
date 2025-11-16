"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimePicker from "@/components/ui/time-picker";
import Workers from "@/components/workers";
import { config } from "@/lib/config";
import { formatDecimalHoursToTime, formatToTwoDecimals } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function Page() {
  const [rate, setRate] = useState(10);
  const [startTime, setStartTime] = useState("09:00:00");
  const [endTime, setEndTime] = useState("11:00:00");

  // Only log in development or when explicitly enabled
  if (config.features.consoleLogs) {
    console.log("Rendering Page");
  }

  const timeStringToMinutes = (timeValue: string) => {
    const [hours = "0", minutes = "0"] = timeValue.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  };

  const shiftDurationHours: { displayFormat: string; decimalFormat: number } =
    useMemo(() => {
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
    }, [endTime, startTime]);

  return (
    <div className="w-full mx-auto min-w-[300px] max-w-[1200px] min-h-screen">
      <div>
        <div className="text-left m-auto py-4 space-y-4">
          <h1 className="text-4xl tracking-tight">Work Rate Calculator</h1>
          <p className="text-sm w-1/2 text-muted-foreground tracking-wide">
            The Work Rate Calculator balances relative percentages (between
            workers) based on their rate of work, taken as a percentage of the
            expected rate.
          </p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-6 mb-2 w-full md:grid-cols-2 ">
          <Card className="flex flex-col justify-between items-start gap-4 border-2 bg-gray-500 p-4 text-white/80">
            <div className="flex justify-between items-center w-full">
              <Label className="text-xl uppercase" htmlFor="workers">
                Expected rate:
              </Label>
              <Input
                type="number"
                step={1}
                min={1}
                value={rate}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  if (parsedValue <= 0) return;
                  setRate(parsedValue);
                }}
                className="max-w-sm w-40 bg-white text-primary shrink-0 text-right "
                id="workers"
              />
            </div>
            <div className="text-xs w-3/4 leading-tight tracking-wide pr-8 space-y-2 font-light">
              <p>
                The expected rate is the rate each worker should be aiming to
                achieve. This won&apos;t affect percentages, but is for your own
                reference.
              </p>
              <p className="italic">
                <span className="italic underline">NOTE:</span> This has no
                effect on relative percentages
              </p>
            </div>
          </Card>
          <Card className="flex flex-col gap-4 border-2 p-4  bg-gray-500 text-white/80 active:ring-2">
            <div className="flex items-center justify-between">
              {/* <Label className="underline" htmlFor="shift-length">
                Shift length (hours):
              </Label>
              <Input
                type="text"
                value={formattedShiftLength}
                readOnly
                className="max-w-sm w-20 shrink-0 text-right"
                id="shift-length"
              /> */}
              <div className="flex justify-between w-full uppercase text-xl">
                <div className="flex justify-start gap-2 font-light">
                  Shift Length{" "}
                  <span className="text-sm flex items-center justify-start">
                    (hours:minutes)
                  </span>{" "}
                </div>
                <span className="bg-white text-primary rounded-sm px-2 text-sm flex items-center w-1/4 justify-end">
                  {shiftDurationHours.displayFormat}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-white/80">
              <TimePicker
                value={startTime}
                onChange={setStartTime}
                label="Shift start time"
                id="shift-start"
                ariaLabel="Shift start time"
              />
              <TimePicker
                value={endTime}
                onChange={setEndTime}
                label="Shift end time"
                id="shift-end"
                ariaLabel="Shift end time"
              />
            </div>

            <div className="text-sm flex gap-6">
              <p className="text-xs w-3/4 leading-wide tracking-tight pr-8 text-white/80">
                If shift lengths vary per worker, set the actual shift length
                here (and adjust each worker below).
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Workers defaultRate={rate} shiftLength={shiftDurationHours} />
    </div>
  );
}
