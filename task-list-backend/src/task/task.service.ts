import { Injectable } from '@nestjs/common';
import { Prisma, Task as TaskEntity } from '@prisma/client';
import * as dayjs from 'dayjs';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { TaskFindAllResponse } from './types/task-find-all.response';
import { Task } from './types/task.model';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskFindAllResponse> {
    const paginate = createPaginator({ page: 1 });

    const result = await paginate<TaskEntity, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        orderBy: {
          id: 'desc',
        },
      },
    );

    const response: TaskFindAllResponse = { data: [], meta: result.meta };

    for (const v of result.data) {
      response.data.push({
        status: this.getTaskStatus(v.dueDate),
        ...v,
      });
    }

    return response;
  }

  async findOne(id: number): Promise<Task | null> {
    const taskEntity = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (taskEntity === null) {
      return null;
    }

    const task: Task = {
      status: this.getTaskStatus(taskEntity.dueDate),
      ...taskEntity,
    };

    return task;
  }

  getTaskStatus(dueDate: Date): string {
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
}
