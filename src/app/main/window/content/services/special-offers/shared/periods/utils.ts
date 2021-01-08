import { weekDays } from '@/app/main/window/shared/periods/consts';

export function extractWeekDay(date: Date) {
  const dayIndex = (date.getDay() + 6) % 7;

  return weekDays[dayIndex];
}
