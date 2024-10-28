import { Task as TaskEntity } from '@prisma/client';
import { getTaskStatus } from '../task.util';
export class Task {
  id: number;

  name: string;

  description: string;

  dueDate: Date;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}

export function taskFromEntity(taskEntity: TaskEntity): Task {
  const task = new Task();
  task.id = taskEntity.id;
  task.name = taskEntity.name;
  task.description = taskEntity.description;
  task.dueDate = taskEntity.dueDate;
  task.status = getTaskStatus(taskEntity.dueDate);
  task.createdAt = taskEntity.createdAt;
  task.updatedAt = taskEntity.updatedAt;

  return task;
}
