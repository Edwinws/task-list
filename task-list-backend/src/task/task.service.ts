import { Injectable } from '@nestjs/common';
import { Prisma, Task as TaskEntity } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { CreateTaskParam } from './types/create-task.param';
import { TaskFindAllResponse } from './types/task-find-all.response';
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
  ): Promise<TaskFindAllResponse> {
    const paginate = createPaginator({ page, perPage: 10 });

    const result = await paginate<TaskEntity, Prisma.TaskFindManyArgs>(
      this.prisma.task,
      {
        orderBy: {
          [sortBy]: sortOrder,
        },
      },
    );

    const response: TaskFindAllResponse = { data: [], meta: result.meta };

    for (const v of result.data) {
      response.data.push(taskFromEntity(v));
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
}
