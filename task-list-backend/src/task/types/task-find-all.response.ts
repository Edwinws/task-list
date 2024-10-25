import { PaginationMeta } from 'src/types/pagination-meta';
import { Task } from './task.model';

export interface TaskFindAllResponse {
  data: Task[];
  meta: PaginationMeta;
}
