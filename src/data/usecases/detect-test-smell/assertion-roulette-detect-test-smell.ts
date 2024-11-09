import { TestModel } from '../../../domain/models';
import { DetectTestSmell } from '../../../domain/usecases';

export class AssertionRoulletDetectTestSmell implements DetectTestSmell {
  execute(test: TestModel): boolean {
    return test.asserts.length > 1 && test.asserts.some((assert) => !assert.message);
  }
}
