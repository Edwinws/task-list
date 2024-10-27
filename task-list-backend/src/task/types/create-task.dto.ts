import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { CreateTaskParam } from './create-task.param';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  toParam(): CreateTaskParam {
    return {
      name: this.name,
      description: this.description,
      dueDate: new Date(this.dueDate),
      createdAt: null,
    };
  }
}
