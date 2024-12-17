import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";

export const groupByTimeInterval = (logs, interval) => {
  const groupedData = {};

  logs.forEach((log) => {
    const date = new Date(log.purchase_date);
    let key;

    switch (interval) {
      case "daily":
        key = format(date, "yyyy-MM-dd"); // Group by day
        break;

      case "weekly":
        // Get the start of the week and format it as "yyyy-MM-dd"
        key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
        break;

      case "monthly":
        // Get the start of the month and format it as "yyyy-MM-dd"
        key = format(startOfMonth(date), "yyyy-MM-dd");
        break;

      case "yearly":
        // Get the start of the year and format it as "yyyy-MM-dd"
        key = format(startOfYear(date), "yyyy-MM-dd");
        break;

      default:
        key = format(date, "yyyy-MM-dd"); // Default to daily
        break;
    }

    if (!groupedData[key]) {
      groupedData[key] = { distance: 0, liters: 0 };
    }

    groupedData[key].distance += log.distance_traveled;
    groupedData[key].liters += log.fuel_liters_quantity;
  });

  // Return the grouped data with the formatted key and values
  return Object.entries(groupedData).map(([key, value]) => ({
    label: key,
    ...value,
  }));
};