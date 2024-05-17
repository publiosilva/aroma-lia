import { Test } from "../test-extractors/ast-test-extractor";

export interface TestSmellDetector {
  isPresent(test: Test): boolean
}
