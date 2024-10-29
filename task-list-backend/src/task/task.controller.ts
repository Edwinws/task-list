import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './types/create-task.dto';
import { TaskFindAllResponse } from './types/task-find-all.response';
import { Task, taskFromEntity } from './types/task.model';
import { UpdateTaskDto } from './types/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async taskFindAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
    @Query('search') search: string,
  ): Promise<TaskFindAllResponse> {
    const result = await this.taskService.findAll(
      page,
      sortBy,
      sortOrder,
      search,
    );
    const response: TaskFindAllResponse = { data: [], meta: result.meta };

    for (const k in result.data) {
      response.data.push(taskFromEntity(result.data[k]));
    }

    return response;
  }

  @Get(':id')
  async taskFindOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task = await this.taskService.findOne(id);

    if (task === null) {
      // TODO: Should return a 404 error
      throw new BadRequestException('Task not found');
    }

    return task;
  }

  @Post()
  async taskCreate(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto.toParam());
  }

  @Put(':id')
  async taskUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(updateTaskDto.toParam(id));
  }
}
