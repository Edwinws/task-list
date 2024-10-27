import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './types/create-task.dto';
import { TaskFindAllResponse } from './types/task-find-all.response';
import { Task } from './types/task.model';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async taskFindAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ): Promise<TaskFindAllResponse> {
    return this.taskService.findAll(page);
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
}
