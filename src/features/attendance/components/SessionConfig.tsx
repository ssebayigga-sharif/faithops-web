import {
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  TextInput,
} from "@carbon/react";
import type { ServiceType } from "@/features/attendance/types";

interface SessionConfigProps {
  date: Date;
  serviceType: ServiceType;
  markedBy: string;
  serviceTypes: string[];
  onDateChange: (date: Date) => void;
  onServiceTypeChange: (type: ServiceType) => void;
  onMarkedByChange: (name: string) => void;
}

export function SessionConfig({
  date,
  serviceType,
  markedBy,
  serviceTypes,
  onDateChange,
  onServiceTypeChange,
  onMarkedByChange,
}: SessionConfigProps) {
  return (
    <div
      className="attendancepage__config"
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      <DatePicker
        datePickerType="single"
        dateFormat="m/d/Y"
        value={date}
        onChange={([d]) => {
          if (d) onDateChange(d);
        }}
        maxDate={new Date().toLocaleDateString("en-US")}
      >
        <DatePickerInput
          id="att-date"
          labelText="Service Date"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>

      <Select
        id="att-service"
        labelText="Service Type"
        value={serviceType}
        onChange={(e) => onServiceTypeChange(e.target.value as ServiceType)}
      >
        {serviceTypes.map((s) => (
          <SelectItem key={s} value={s} text={s} />
        ))}
      </Select>

      <TextInput
        id="att-markedBy"
        labelText="Marked By"
        placeholder="Your name"
        value={markedBy}
        onChange={(e) => onMarkedByChange(e.target.value)}
      />
    </div>
  );
}

export default SessionConfig;
