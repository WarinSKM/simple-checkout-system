"use client";

import * as React from "react";
import { format } from "date-fns";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value?: DateRange | undefined;
  onChange?: SelectRangeEventHandler;
}

export function DatePickerWithRange({ className, value, onChange }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className={cn("w-[220px] justify-start text-left font-normal", !value && "text-muted-foreground")}>
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd/MM/y")} - {format(value.to, "dd/MM/y")}
                </>
              ) : (
                format(value.from, "dd/MM/y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="range" defaultMonth={value?.from} selected={value} onSelect={onChange} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
