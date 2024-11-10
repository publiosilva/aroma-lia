import ast from '../examples/javascript/my-test-class.ast.json';
import { makeAssertionRouletteDetectTestSmellService, makeDuplicateAssertDetectTestSmellService, makeJavascriptJestExtractTestsFromAST } from './main/factories/services';

(() => {
  const assertionRoulletDetectTestSmell = makeAssertionRouletteDetectTestSmellService();
  const duplicateAssertDetectTestSmell = makeDuplicateAssertDetectTestSmellService();
  const javascriptExtractor = makeJavascriptJestExtractTestsFromAST();

  const javascriptTests = javascriptExtractor.execute(ast);

  console.log(JSON.stringify({ javascriptTests }, null, 2));

  const testsWithDuplicatedAssertTestSmell = javascriptTests.filter(
    (test) => duplicateAssertDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const testsWithAssertionRoulletTestSmell = javascriptTests.filter(
    (test) => assertionRoulletDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
