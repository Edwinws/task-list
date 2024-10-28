import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinDate } from 'class-validator';
import { UpdateTaskParam } from './update-task.param';

export class UpdateTaskDto {
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

  toParam(id: number): UpdateTaskParam {
    return {
      id: id,
      name: this.name,
      description: this.description,
      dueDate: new Date(this.dueDate),
    };
  }
}
