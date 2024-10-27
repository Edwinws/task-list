import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinDate } from 'class-validator';
import { CreateTaskParam } from './create-task.param';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @MinDate(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000), {
    message: 'dueDate must be tomorrow onwards',
  })
  dueDate: Date;

  toParam(): CreateTaskParam {
    return {
      name: this.name,
      description: this.description,
      dueDate: new Date(this.dueDate),
      createdAt: null,
    };
  }
}
