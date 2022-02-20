export function getWeekRangeDates() {
  const weekStartDate: Date = new Date(
    new Date().setDate(new Date().getDate() - new Date().getDay() + 1),
  );
  const weekEndDate: Date = new Date(
    new Date().setDate(weekStartDate.getDate() + 6),
  );

  return { weekStartDate, weekEndDate };
}
