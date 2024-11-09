import ast from '../examples/javascript/my-test-class.ast.json';
import { AssertionRoulletDetectTestSmell, DuplicateAssertDetectTestSmell, JavascriptJestExtractTestsFromAST } from './data/usecases';

(() => {
  const javascriptExtractor = new JavascriptJestExtractTestsFromAST();

  const javascriptTests = javascriptExtractor.execute(ast);

  console.log(JSON.stringify({ javascriptTests }, null, 2));

  const duplicateAssertDetectTestSmell = new DuplicateAssertDetectTestSmell();

  const testsWithDuplicatedAssertTestSmell = javascriptTests.filter(
    (test) => duplicateAssertDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const assertionRoulletDetectTestSmell = new AssertionRoulletDetectTestSmell();

  const testsWithAssertionRoulletTestSmell = javascriptTests.filter(
    (test) => assertionRoulletDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
