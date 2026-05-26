import { timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";

// Create this component in the same file or separate file
const TimeCell = ({ timestamp }: { timestamp: number | string | Date }) => {
  const [time, setTime] = useState<string>("-");

  useEffect(() => {
    setTime(timeAgo(timestamp));
  }, [timestamp]);

  return <>{time}</>;
};

export default TimeCell;
