import { ASTModel, ASTNodeModel, FunctionOrMethodInvocationModel, TestAssertModel, TestSwitchModel } from '../../domain/models';
import { ExtractTestsFromAST, FindAllClassDeclarations, FindAllFunctionOrMethodDeclarations, FindAllFunctionOrMethodInvocations, GetLiteralValue } from '../../domain/usecases';

export class PythonUnittestExtractTestsFromASTService implements ExtractTestsFromAST {
  constructor(
    private findAllClassDeclarations: FindAllClassDeclarations,
    private findAllMethodDeclarations: FindAllFunctionOrMethodDeclarations,
    private findAllMethodInvocations: FindAllFunctionOrMethodInvocations,
    private getLiteralValue: GetLiteralValue
  ) { }

  execute(ast: ASTModel): TestSwitchModel[] {
    const testSwitches: TestSwitchModel[] = [];
    const classDeclarations = this.findAllClassDeclarations.execute(ast);

    classDeclarations.forEach((classDeclaration) => {
      if (classDeclaration.superclasses?.includes('unittest.TestCase')) {
        const methodDeclarations = this.findAllMethodDeclarations.execute(classDeclaration.node);

        if (methodDeclarations.some(({ identifier }) => identifier.startsWith('test'))) {
          const testSwitch: TestSwitchModel = {
            isIgnored: classDeclaration.decorators?.some(({ identifier }) => identifier === 'skip') || false,
            name: classDeclaration.identifier,
            tests: [],
          };

          methodDeclarations.forEach((methodDeclaration) => {
            if (methodDeclaration?.identifier?.startsWith('test')) {
              testSwitch.tests.push({
                asserts: this.extractAsserts(methodDeclaration.node),
                endLine: methodDeclaration.node.span[2],
                isExclusive: false,
                isIgnored: methodDeclaration.decorators?.some(({ identifier }) => identifier === 'skip') || false,
                name: methodDeclaration.identifier,
                startLine: methodDeclaration.node.span[0],
              });
            }
          });

          testSwitches.push(testSwitch);
        }
      }
    });

    return testSwitches;
  }

  private extractAsserts(node: ASTNodeModel): TestAssertModel[] {
    const methodInvocations = this.findAllMethodInvocations.execute(node);
    const assertMethods = [
      'assertEqual',
      'assertTrue',
      'assertFalse',
      'assertIs',
      'assertIsNot',
      'assertIsNone',
      'assertIsNotNone',
      'assertIn',
      'assertNotIn',
      'assertGreater',
      'assertGreaterEqual',
      'assertLess',
      'assertLessEqual',
    ];
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) =>
      assertMethods.includes(identifier)
    );

    return assertMethodInvocations.map((methodInvocation) => this.extractAssertData(methodInvocation));
  }

  private extractAssertData(methodInvocation: FunctionOrMethodInvocationModel): TestAssertModel {
    const testAssert: TestAssertModel = {
      matcher: methodInvocation.identifier,
    };

    if (methodInvocation.parameterNodes?.length) {
      testAssert.literalActual = this.getLiteralValue.execute(methodInvocation.parameterNodes[0]);

      if (methodInvocation.parameterNodes.length > 1) {
        if (['assertTrue', 'assertFalse', 'assertIsNone', 'assertIsNotNone'].includes(methodInvocation.identifier)) {
          testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        } else {
          testAssert.literalExpected = this.getLiteralValue.execute(methodInvocation.parameterNodes[1]);
        }
      }

      if (methodInvocation.parameterNodes.length > 2) {
        testAssert.message = this.getLiteralValue.execute(methodInvocation.parameterNodes[2]);
      }
    }

    return testAssert;
  }
}
