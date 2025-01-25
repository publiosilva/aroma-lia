import { TestSmell, TestSwitchModel } from '../../domain/models';
import { DetectTestSmell } from '../../domain/usecases';

export class DetectDuplicateAssertTestSmellService implements DetectTestSmell {
  execute(testSwitch: TestSwitchModel): TestSmell[] {
    const testSmells: TestSmell[] = [];

    for (const test of testSwitch.tests) {
      const seenAssertionsKeys = new Set<string>();
      const seenAssertionsMessages = new Set<string>();

      for (const assert of test.asserts) {
        const assertKey = `${assert.literalActual}-${assert.matcher}-${assert.literalExpected}`;
        const assertMessage = assert.message;

        if (seenAssertionsKeys.has(assertKey) || (assertMessage && seenAssertionsMessages.has(assertMessage))) {
          testSmells.push({
            name: 'DuplicateAssert',
            test,
            testSwitch,
            startLine: assert.startLine,
            endLine: assert.endLine,
          });
        } else {
          seenAssertionsKeys.add(assertKey);

          if (assertMessage) {
            seenAssertionsMessages.add(assertMessage);
          }
        }
      }
    }

    return testSmells;
  }
}
