import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskFindAllResponse } from './types/task-find-all.response';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async taskFindAll(): Promise<TaskFindAllResponse> {
    return this.taskService.findAll();
  }
}
