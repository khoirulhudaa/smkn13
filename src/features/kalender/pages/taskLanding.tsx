import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  Calendar,
  cn,
  dayjs,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { CalendarIcon, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { HomeWorkLanding } from "../container";

export const WorkHomeMainLanding = () => {
  const [date, setDate] = useState<Date | undefined>(undefined); // No default date
  const [formattedDate, setFormattedDate] = useState<string>(""); // No default formatted date
  const [tahun, setTahun] = useState<string>(dayjs().format("YYYY")); // Initialize with current year

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const formatted = dayjs(selectedDate).format("DD-MM-YYYY");
      setFormattedDate(formatted);
      console.log("Selected Date:", formatted, "Year:", tahun);
    } else {
      setFormattedDate("");
      console.log("No valid date selected");
    }
  };

  // Handle reset date
  const handleResetDate = () => {
    setDate(undefined);
    setFormattedDate("");
    console.log("Date reset: No date selected, Year:", tahun);
  };

  // Generate years: current year and 5 years before
  const years = Array.from({ length: 6 }, (_, i) => dayjs().year() - 5 + i);

  // Debugging logs
  console.log('Formatted Date di LibraryLanding:', formattedDate || 'No date selected');
  console.log('Tahun di LibraryLanding:', tahun);

  return (
    <div className="p-8 text-gray-800 dark:text-white">
      
      {/* header */}
      <div className="bg-transparent border-b border-white/20 pb-4 text-white mb-4 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-xl font-semibold tracking-tight">
              Daftar pekerjaan rumah
            </h1>
            <p className="text-gray-300 dark:text-gray-400 mt-1">
              Dashboard layanan untuk Guru & Tendik
            </p>
          </div>
        </div>
      </div>
      {/* <h2 className="text-3xl font-bold mb-8 text-teal-600 dark:text-teal-400">
        {lang.text('task')}
      </h2> */}

      {/* <div className="bg-white dark:bg-gray-800/80 p-4 border border-white/20 rounded-xl flex items-center gap-3.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
                "bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date && !isNaN(date.getTime()) ? (
                dayjs(date).format("DD MMMM YYYY")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </PopoverContent>
        </Popover>
        <Select value={tahun} onValueChange={setTahun}>
          <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800/80 p-4 border border-white/20 outline-none focus:border-none rounded-md">
            <SelectValue placeholder="Pilih tahun" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800/80 p-4 border border-white/20 rounded-md">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formattedDate && (
          <Button
            variant={"outline"}
            className="bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
            onClick={handleResetDate}
          >
            Reset
          </Button>
        )}
      </div> */}
      <HomeWorkLanding formattedDate={formattedDate || undefined} tahun={tahun} />
    </div>
  );
};