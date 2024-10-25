import { Injectable } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const paginate = createPaginator({ page: 1 });

    const result = await paginate<Task, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        orderBy: {
          id: 'desc',
        },
      },
    );

    return result;
  }
}
