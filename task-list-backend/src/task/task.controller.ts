import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './types/create-task.dto';
import { TaskFindAllResponse } from './types/task-find-all.response';
import { Task } from './types/task.model';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async taskFindAll(): Promise<TaskFindAllResponse> {
    return this.taskService.findAll();
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
