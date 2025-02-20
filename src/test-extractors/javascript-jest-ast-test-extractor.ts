import { ASTNode, ASTProgram, ASTTestExtractor, Test, TestAssert } from "./ast-test-extractor";
import { MethodOrFunctionInvocation, findAllFunctionInvocations, getLiteralValue, isInsideOf } from "./util";

export class JavascriptJestASTTestExtractor implements ASTTestExtractor {
  private tests: Test[] = [];

  extract(ast: ASTProgram): Test[] {
    this.extractTests(ast);
    return this.tests;
  }

  private extractTests(node: ASTNode): void {
    const functionInvocations = findAllFunctionInvocations(node);
    const testFunctionInvocations = functionInvocations.filter((item) => ['it', 'test'].includes(item.identifier));
    const assertFunctionInvocations = functionInvocations.filter((item) => item.identifier === 'expect');

    testFunctionInvocations.forEach((testInvocation) => {
      const testName = this.extractTestName(testInvocation);

      const asserts = assertFunctionInvocations.filter((assertInvocation) => isInsideOf(assertInvocation.node, testInvocation.node)).map((assertNode) => this.extractAssertData(assertNode));

      this.tests.push({ name: testName, asserts });
    });
  }

  private extractAssertData(assertInvocation: MethodOrFunctionInvocation): TestAssert {
    const testAssert: TestAssert = {};

    testAssert.literalActual = assertInvocation.parameterNodes?.length ? getLiteralValue(assertInvocation.parameterNodes[0]) : undefined;
    testAssert.matcher = assertInvocation.chained?.identifier
    testAssert.literalExpected = assertInvocation.chained?.parameterNodes?.length ? getLiteralValue(assertInvocation.chained?.parameterNodes[0]) : undefined

    return testAssert;
  }

  private extractTestName(testInvocation: MethodOrFunctionInvocation): string {
    return testInvocation.parameterNodes?.length ? testInvocation.parameterNodes[0]?.value : '';
  }
}
