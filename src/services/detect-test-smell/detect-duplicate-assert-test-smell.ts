import { TestSmell, TestSwitchModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectDuplicateAssertTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    for (const test of testSwitch.tests) {
      const seenAssertions = new Set<string>();

      for (const assert of test.asserts) {
        const assertKey = `${assert.literalActual}-${assert.matcher}-${assert.literalExpected}`;

        if (seenAssertions.has(assertKey)) {
          testSmells.push({
            name: 'DuplicateAssert',
            test,
            testSwitch,
            startLine: assert.startLine,
            endLine: assert.endLine,
          });
        } else {
          seenAssertions.add(assertKey);
        }
      }
    }

    return testSmells;
  }
}
