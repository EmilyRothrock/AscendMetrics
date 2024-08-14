export const fieldOptions = [
  { value: "name", label: "Name" },
  { value: "notes", label: "Notes" },
  { value: "activities", label: "Activities" },
  { value: "completedOn", label: "Date" },
  { value: "loads", label: "Loads" },
  { value: "duration", label: "Duration" },
];

export type FieldName = (typeof fieldOptions)[number]["value"];
