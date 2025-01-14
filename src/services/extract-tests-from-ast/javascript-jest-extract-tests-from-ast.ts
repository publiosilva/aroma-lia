import { TestModel, ASTModel, ASTNodeModel, TestAssertModel, FunctionOrMethodInvocationModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllFunctionInvocations, GetLiteralValue, IsAInsideOfB } from '../../domain/usecases';

export class JavascriptJestExtractTestsFromASTService implements ExtractTestsFromAST {
  private tests: TestModel[] = [];

  constructor(
    private findAllFunctionInvocations: FindAllFunctionInvocations,
    private getLiteralValue: GetLiteralValue,
    private isAInsideOfB: IsAInsideOfB,
  ) { }

  execute(ast: ASTModel): TestModel[] {
    this.extractTests(ast);

    return this.tests;
  }

  private extractTests(node: ASTNodeModel): void {
    const functionInvocations = this.findAllFunctionInvocations.execute(node);
    const testFunctionInvocations = functionInvocations.filter((item) => ['it', 'test', 'xit', 'xtest'].includes(item.identifier));
    const assertFunctionInvocations = functionInvocations.filter((item) => item.identifier === 'expect');

    testFunctionInvocations.forEach((testInvocation) => {
      const testName = this.extractTestName(testInvocation);

      const asserts = assertFunctionInvocations.filter((assertInvocation) => this.isAInsideOfB.execute(assertInvocation.node, testInvocation.node)).map((assertNode) => this.extractAssertData(assertNode));

      this.tests.push({ name: testName, asserts });
    });
  }

  private extractAssertData(assertInvocation: FunctionOrMethodInvocationModel): TestAssertModel {
    const testAssert: TestAssertModel = {};

    testAssert.literalActual = assertInvocation.parameterNodes?.length ? this.getLiteralValue.execute(assertInvocation.parameterNodes[0]) : undefined;
    testAssert.matcher = assertInvocation.chained?.identifier
    testAssert.literalExpected = assertInvocation.chained?.parameterNodes?.length ? this.getLiteralValue.execute(assertInvocation.chained?.parameterNodes[0]) : undefined

    return testAssert;
  }

  private extractTestName(testInvocation: FunctionOrMethodInvocationModel): string {
    return testInvocation.parameterNodes?.length ? testInvocation.parameterNodes[0]?.value : '';
  }
}
