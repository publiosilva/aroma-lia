import { ASTModel, ASTNodeModel, TestAssertModel, TestModel } from '../../../domain/models';
import { ExtractTestsFromAST } from '../../../domain/usecases';
import { findAllFunctionInvocations, getLiteralValue, isInsideOf, MethodOrFunctionInvocation } from '../../../test-extractors/util';

export class JavascriptJestExtractTestsFromAST implements ExtractTestsFromAST {
  private tests: TestModel[] = [];

  execute(ast: ASTModel): TestModel[] {
    this.extractTests(ast);

    return this.tests;
  }

  private extractTests(node: ASTNodeModel): void {
    const functionInvocations = findAllFunctionInvocations(node);
    const testFunctionInvocations = functionInvocations.filter((item) => ['it', 'test'].includes(item.identifier));
    const assertFunctionInvocations = functionInvocations.filter((item) => item.identifier === 'expect');

    testFunctionInvocations.forEach((testInvocation) => {
      const testName = this.extractTestName(testInvocation);

      const asserts = assertFunctionInvocations.filter((assertInvocation) => isInsideOf(assertInvocation.node, testInvocation.node)).map((assertNode) => this.extractAssertData(assertNode));

      this.tests.push({ name: testName, asserts });
    });
  }

  private extractAssertData(assertInvocation: MethodOrFunctionInvocation): TestAssertModel {
    const testAssert: TestAssertModel = {};

    testAssert.literalActual = assertInvocation.parameterNodes?.length ? getLiteralValue(assertInvocation.parameterNodes[0]) : undefined;
    testAssert.matcher = assertInvocation.chained?.identifier
    testAssert.literalExpected = assertInvocation.chained?.parameterNodes?.length ? getLiteralValue(assertInvocation.chained?.parameterNodes[0]) : undefined

    return testAssert;
  }

  private extractTestName(testInvocation: MethodOrFunctionInvocation): string {
    return testInvocation.parameterNodes?.length ? testInvocation.parameterNodes[0]?.value : '';
  }
}
