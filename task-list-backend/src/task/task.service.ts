import { Injectable } from '@nestjs/common';
import { Prisma, Task as TaskEntity } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { CreateTaskParam } from './types/create-task.param';
import { TaskFindAllResponse } from './types/task-find-all.response';
import { createTaskFromEntity, Task } from './types/task.model';

// TODO: Create Repository layer
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
      response.data.push(createTaskFromEntity(v));
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

    return createTaskFromEntity(taskEntity);
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

    return createTaskFromEntity(taskEntity);
  }
}
