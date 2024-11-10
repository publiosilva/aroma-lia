import { TestModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class AssertionRouletteDetectTestSmellService implements DetectTestSmell {
  execute(test: TestModel): boolean {
    const hasMoreThanOneAssert = test.asserts.length > 1;
    const hasSomeAssertWithoutAnyMessage = test.asserts.some((assert) => !assert.message);

    return hasMoreThanOneAssert && hasSomeAssertWithoutAnyMessage;
  }
}
