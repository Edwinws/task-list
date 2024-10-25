import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import * as dayjs from 'dayjs';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { TaskFindAllResponse } from './types/task-find-all.response';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskFindAllResponse> {
    const paginate = createPaginator({ page: 1 });

    const result = await paginate<Task, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        orderBy: {
          id: 'desc',
        },
      },
    );

    const response: TaskFindAllResponse = { data: [], meta: result.meta };
    const today = dayjs();

    for (const v of result.data) {
      let status = '';
      const dueDate = dayjs(v.dueDate);
      const daysDifference = dueDate.diff(today, 'day');

      if (daysDifference > 7) {
        status = 'Not Urgent'; // TODO: Should be an enum
      } else if (daysDifference >= 0 && daysDifference <= 7) {
        status = 'Due soon';
      } else {
        status = 'Overdue';
      }

      response.data.push({
        status,
        ...v,
      });
    }

    return response;
  }
}
