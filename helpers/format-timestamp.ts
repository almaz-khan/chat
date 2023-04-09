import { format } from "date-fns";

export const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};
