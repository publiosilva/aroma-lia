import { Test } from "../test-extractors/ast-test-extractor";
import { TestSmellDetector } from "./test-smell-detector";

export class AssertionRoulletTestSmellDetector implements TestSmellDetector {
  isPresent(test: Test): boolean {
    return test.asserts.length > 1 && test.asserts.some((assert) => !assert.message);
  }
}
