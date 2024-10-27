import * as dayjs from 'dayjs';

export function getTaskStatus(dueDate: Date): string {
  const today = dayjs();
  const dueDateDayjs = dayjs(dueDate);
  const daysDifference = dueDateDayjs.diff(today, 'day');

  if (daysDifference > 7) {
    return 'Not Urgent'; // TODO: Should be an enum
  } else if (daysDifference >= 0 && daysDifference <= 7) {
    return 'Due soon';
  } else {
    return 'Overdue';
  }
}
