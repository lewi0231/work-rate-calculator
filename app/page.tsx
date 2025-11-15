"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Workers from "@/components/workers";
import { config } from "@/lib/config";
import { formatToTwoDecimals } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const ADD_SUBTRACT_VALUE = 0.25;

export default function Page() {
  const [rate, setRate] = useState(10);
  const [shiftLength, setShiftLength] = useState("2.00");

  // Only log in development or when explicitly enabled
  if (config.features.consoleLogs) {
    console.log("Rendering Page");
  }

  const onIncrement = () => {
    const numberValue = parseFloat(shiftLength);
    const newValue = numberValue + ADD_SUBTRACT_VALUE;
    setShiftLength(formatToTwoDecimals(newValue));
  };

  const onDecrement = () => {
    const numberValue = parseFloat(shiftLength);
    const newValue = numberValue - ADD_SUBTRACT_VALUE;

    if (newValue <= 0) return;
    setShiftLength(formatToTwoDecimals(newValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow valid numbers
    if (/^\d*\.?\d{0,2}$/.test(inputValue) || inputValue === "") {
      setShiftLength(inputValue);
    }
  };

  return (
    <div className="w-3/4 sm:w-2/3 lg:w-1/2 m-auto sm:max-w-[700px] min-w-[300px]">
      <div>
        <div className="text-left m-auto py-10 space-y-4">
          <h1 className="text-4xl">Work Rate Calculator</h1>
          <p className="text-sm">
            The Work Rate Calculator balances relative percentages (between
            workers) based on their rate of work, taken as a percentage of the
            expected rate.
          </p>
          {config.features.debugMode && (
            <p className="text-xs text-gray-500">
              Environment: {config.env} | URL: {config.appUrl}
            </p>
          )}
        </div>
      </div>
      <div className="">
        <div className="flex justify-between mb-2 w-full gap-6">
          <div className="flex justify-between w-1/2 items-center">
            <Label className="underline" htmlFor="workers">
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
              className="max-w-sm w-20 shrink-0 text-right"
              id="workers"
            />
          </div>
          <div className="flex justify-between w-1/2 items-center">
            <Label className="underline" htmlFor="shift">
              Shift length (hours):
            </Label>
            <div className="flex items-center">
              <Input
                type="text"
                value={shiftLength}
                onChange={handleInputChange}
                className="max-w-sm w-20 shrink-0 text-right"
                id="shift"
                disabled
              />
              <div className="flex flex-col">
                <Button
                  size="sm"
                  variant="ghost"
                  className=""
                  onClick={onIncrement}
                >
                  <Plus className="" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className=""
                  onClick={onDecrement}
                >
                  <Minus className="" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm flex gap-4">
          <p className="text-xs opacity-80 w-1/2 leading-tight tracking-tight pr-8">
            The expected rate is the rate each worker should be aiming to
            achieve. This won&apos;t affect percentages, but is for your own
            reference.
          </p>

          <p className="text-xs opacity-80 w-1/2 leading-tight tracking-tight pr-8">
            If shift lengths vary per worker, set the actual shift length here
            (and adjust each worker below).
          </p>
        </div>
      </div>
      <hr className="mt-10"></hr>
      <Workers defaultRate={rate} shiftLength={parseFloat(shiftLength)} />
    </div>
  );
}
