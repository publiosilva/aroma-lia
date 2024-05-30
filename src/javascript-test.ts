import ast from '../examples/javascript/my-test-class.ast.json';
import { AssertionRoulletTestSmellDetector } from './test-smell-detectors/assertion-roullet-test-smell-detector';
import { DuplicateAssertTestSmellDetector } from './test-smell-detectors/duplicate-assert-test-smell-detector';
import { JavascriptJestASTTestExtractor } from './test-extractors/javascript-jest-ast-test-extractor';

(() => {
  const javascriptExtractor = new JavascriptJestASTTestExtractor();

  const javascriptTests = javascriptExtractor.extract(ast);

  console.log(JSON.stringify({ javascriptTests }, null, 2));

  const duplicateAssertTestSmellDetector = new DuplicateAssertTestSmellDetector();

  const testsWithDuplicatedAssertTestSmell = javascriptTests.filter(
    (test) => duplicateAssertTestSmellDetector.isPresent(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const assertionRoulletTestSmellDetector = new AssertionRoulletTestSmellDetector();

  const testsWithAssertionRoulletTestSmell = javascriptTests.filter(
    (test) => assertionRoulletTestSmellDetector.isPresent(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
