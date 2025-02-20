import _ from 'lodash';
import { Test } from "../test-extractors/ast-test-extractor";
import { TestSmellDetector } from "./test-smell-detector";

export class DuplicateAssertTestSmellDetector implements TestSmellDetector {
  isPresent(test: Test): boolean {
    return _.size(test.asserts) !== _.size(_.uniqWith(test.asserts, _.isEqual));
  }
}
