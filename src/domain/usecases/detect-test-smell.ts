import { TestModel } from '../models';

export interface DetectTestSmell {
  execute(test: TestModel): boolean
}
