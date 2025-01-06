import ast from '../examples/java/MyTestClass.java.ast.json';
import { makeAssertionRouletteDetectTestSmellService, makeDuplicateAssertDetectTestSmellService, makeJavaJUnitExtractTestsFromASTService } from './main/factories/services';


(() => {
  const assertionRoulletDetectTestSmell = makeAssertionRouletteDetectTestSmellService();
  const duplicateAssertDetectTestSmell = makeDuplicateAssertDetectTestSmellService();
  const javaExtractor = makeJavaJUnitExtractTestsFromASTService();

  const javaTests = javaExtractor.execute(ast);

  console.log(JSON.stringify({ javaTests }, null, 2));

  const testsWithDuplicatedAssertTestSmell = javaTests.filter(
    (test) => duplicateAssertDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const testsWithAssertionRoulletTestSmell = javaTests.filter(
    (test) => assertionRoulletDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
