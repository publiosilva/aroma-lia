import { ASTModel, ASTNodeModel, FunctionOrMethodInvocationModel, TestAssertModel, TestModel, TestSwitchModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllClassDeclarations, FindAllMethodDeclarations, FindAllMethodInvocations, GetLiteralValue } from '../../domain/usecases';

export class JavaJUnitExtractTestsFromASTService implements ExtractTestsFromAST {
  private tests: TestModel[] = [];

  constructor(
    private findAllClassDeclarations: FindAllClassDeclarations,
    private findAllMethodDeclarations: FindAllMethodDeclarations,
    private findAllMethodInvocations: FindAllMethodInvocations,
    private getLiteralValue: GetLiteralValue
  ) { }

  execute(ast: ASTModel): TestSwitchModel[] {
    const testSwitches: TestSwitchModel[] = [];
    const classDeclarations = this.findAllClassDeclarations.execute(ast);

    classDeclarations.forEach((classDeclaration) => {
      const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);

      if (methodDeclarations.some(({ annotations }) => annotations?.some(({ identifier }) => identifier === 'Test'))) {
        const testSwitch: TestSwitchModel = {
          isIgnored: classDeclaration.annotations?.some(({ identifier }) => identifier === 'Ignore') || false,
          name: classDeclaration.identifier,
          tests: [],
        };

        methodDeclarations.forEach((methodDeclaration) => {
          if (methodDeclaration?.annotations?.some(({ identifier }) => identifier === 'Test')) {
            testSwitch.tests.push({
              asserts: this.extractAsserts(methodDeclaration.node),
              endLine: methodDeclaration.node.span[2],
              isExclusive: false,
              isIgnored: methodDeclaration.annotations?.some(({ identifier }) => identifier === 'Ignore') || false,
              name: methodDeclaration.identifier,
              startLine: methodDeclaration.node.span[0],
            });
          }
        });

        testSwitches.push(testSwitch);
      }
    });

    return testSwitches;
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);
    const assertMethods = [
      'assertArrayEquals',
      'assertEquals',
      'assertFalse',
      'assertNotNull',
      'assertNotSame',
      'assertNull',
      'assertSame',
      'assertThat',
      'assertTrue',
    ];
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) => assertMethods.includes(identifier));

    return assertMethodInvocations.map((methodInvocation) => this.extractAssertData(methodInvocation))
  }

  private extractAssertData(methodInvocation: FunctionOrMethodInvocationModel): TestAssertModel {
    const testAssert: TestAssertModel = {
      matcher: methodInvocation.identifier
    }

    if (
      [
        'assertArrayEquals',
        'assertEquals',
        'assertNotSame',
        'assertSame',
        'assertThat',
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length === 2) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[1])
        testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[0])
      } else if (methodInvocation.parameterNodes?.length === 3) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[2])
        testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[1])
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0])
      }
    } else if (
      [
        'assertFalse',
        'assertNotNull',
        'assertNull',
        'assertTrue',
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length === 1) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[0])
      } else if (methodInvocation.parameterNodes?.length === 2) {
        testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[1])
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[0])
      }
    }

    return testAssert;
  }
}
