import { Injectable } from '@nestjs/common';
import { Prisma, Task as TaskEntity } from '@prisma/client';
import * as dayjs from 'dayjs';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { CreateTaskParam } from './types/create-task.param';
import { PaginationResponse } from './types/pagination.response';
import { Task, taskFromEntity } from './types/task.model';
import { UpdateTaskParam } from './types/update-task.param';

// TODO: Create Repository layer
@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: move params to class
  async findAll(
    page: number,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    search: string,
  ): Promise<PaginationResponse<TaskEntity>> {
    const paginate = createPaginator({ page, perPage: 10 });

    const result = await paginate<TaskEntity, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: {
          name: {
            contains: search,
          },
        },
      },
    );

    return result;
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

    return taskFromEntity(taskEntity);
  }

  async create(param: CreateTaskParam): Promise<Task> {
    // TODO: Validate param

    const taskEntity = await this.prisma.task.create({
      data: {
        name: param.name,
        description: param.description,
        dueDate: param.dueDate,
        createdAt: param.createdAt ?? new Date(),
      },
    });

    return taskFromEntity(taskEntity);
  }

  async update(param: UpdateTaskParam): Promise<Task> {
    // TODO: Validate param

    const taskEntity = await this.prisma.task.update({
      where: {
        id: param.id,
      },
      data: {
        name: param.name,
        description: param.description,
        dueDate: param.dueDate,
      },
    });

    return taskFromEntity(taskEntity);
  }

  async seedData(count = 5000): Promise<void> {
    const randRange = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const now = new Date();

    const dueDate = dayjs().set('hour', 0).set('minute', 0).set('second', 0);

    for (let i = 0; i < count; i++) {
      const randomStr = Math.random().toString(36).substring(3, 15);

      await this.prisma.task.create({
        data: {
          name: `${randomStr}`,
          description: `${randomStr}`,
          dueDate: dueDate.add(randRange(-1, 15), 'day').toDate(),
          createdAt: now,
        },
      });
    }
  }

  async deleteAllData(): Promise<void> {
    await this.prisma.$queryRaw`TRUNCATE tasks`;
  }
}
