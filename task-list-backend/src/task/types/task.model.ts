import { Task as TaskEntity } from '@prisma/client';
import { getTaskStatus } from '../task.util';
export class Task {
  id: number;

  name: string;

  description: string;

  dueDate: string;

  status: string;

  createdAt: string;

  updatedAt: string;
}

export function taskFromEntity(taskEntity: TaskEntity): Task {
  const task = new Task();
  task.id = taskEntity.id;
  task.name = taskEntity.name;
  task.description = taskEntity.description;
  task.dueDate = formatTaskDate(taskEntity.dueDate);
  task.status = getTaskStatus(taskEntity.dueDate);
  task.createdAt = formatTaskDate(taskEntity.createdAt);
  task.updatedAt = formatTaskDate(taskEntity.updatedAt);

  return task;
}

function formatTaskDate(date: Date): string {
  return date.getTime().toString();
}
