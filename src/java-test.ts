import ast from '../examples/java/MyTestClass.java.ast.json';
import { AssertionRoulletTestSmellDetector } from './test-smell-detectors/assertion-roullet-test-smell-detector';
import { DuplicateAssertTestSmellDetector } from './test-smell-detectors/duplicate-assert-test-smell-detector';
import JavaJUnitASTTestExtractor from './test-extractors/java-junit-ast-test-extractor';

(() => {
  const javaExtractor = new JavaJUnitASTTestExtractor();

  const javaTests = javaExtractor.extract(ast);

  console.log(JSON.stringify({ javaTests }, null, 2));

  const duplicateAssertTestSmellDetector = new DuplicateAssertTestSmellDetector();

  const testsWithDuplicatedAssertTestSmell = javaTests.filter(
    (test) => duplicateAssertTestSmellDetector.isPresent(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const assertionRoulletTestSmellDetector = new AssertionRoulletTestSmellDetector();

  const testsWithAssertionRoulletTestSmell = javaTests.filter(
    (test) => assertionRoulletTestSmellDetector.isPresent(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
