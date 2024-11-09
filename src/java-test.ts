import ast from '../examples/java/MyTestClass.java.ast.json';
import { AssertionRoulletDetectTestSmell, DuplicateAssertDetectTestSmell, JavaJUnitExtractTestsFromAST } from './data/usecases';

(() => {
  const javaExtractor = new JavaJUnitExtractTestsFromAST();

  const javaTests = javaExtractor.execute(ast);

  console.log(JSON.stringify({ javaTests }, null, 2));

  const duplicateAssertDetectTestSmell = new DuplicateAssertDetectTestSmell();

  const testsWithDuplicatedAssertTestSmell = javaTests.filter(
    (test) => duplicateAssertDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithDuplicatedAssertTestSmell }, null, 2));

  const assertionRoulletDetectTestSmell = new AssertionRoulletDetectTestSmell();

  const testsWithAssertionRoulletTestSmell = javaTests.filter(
    (test) => assertionRoulletDetectTestSmell.execute(test)
  );

  console.log(JSON.stringify({ testsWithAssertionRoulletTestSmell }, null, 2));
})();
