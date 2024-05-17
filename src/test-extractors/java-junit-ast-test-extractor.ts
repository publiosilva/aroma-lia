import { ASTNode, ASTProgram, ASTTestExtractor, Test, TestAssert } from "./ast-test-extractor";
import { MethodOrFunctionInvocation, findAllMethodInvocations, getLiteralValue } from "./util";

class JavaJUnitASTTestExtractor implements ASTTestExtractor {
  private tests: Test[] = [];

  extract(ast: ASTProgram): Test[] {
    this.extractTests(ast);
    return this.tests;
  }

  private extractTests(node: ASTNode): void {
    if (this.isTestMethod(node)) {
      const testName = this.extractTestName(node);
      const asserts = this.extractAsserts(node);
      this.tests.push({ name: testName, asserts });
    }

    if (node.children) {
      for (const child of node.children) {
        this.extractTests(child);
      }
    }
  }

  private isTestMethod(node: ASTNode): boolean {
    return node.type === 'method_declaration' && node.children.some((c1) => {
      return c1.type === 'modifiers' && c1.children.some((c2) => {
        return c2.type === 'marker_annotation' && c2.children.some((c3) => {
          return c3.type === 'identifier' && c3.value === 'Test'
        })
      })
    });
  }

  private extractTestName(node: ASTNode): string {
    const stringLiteralArg = node.children.find(child => child.type === 'identifier');
    return stringLiteralArg ? stringLiteralArg.value : '';
  }

  private extractAsserts(node: ASTNode): TestAssert[] {
    const methodInvocations = findAllMethodInvocations(node);
    const assertMethods = [
      "assertArrayEquals",
      "assertEquals",
      "assertFalse",
      "assertNotNull",
      "assertNotSame",
      "assertNull",
      "assertSame",
      "assertThat",
      "assertTrue",
    ];
    const assertMethodInvocations = methodInvocations.filter(({ identifier }) => assertMethods.includes(identifier));

    return assertMethodInvocations.map((methodInvocation) => this.extractAssertData(methodInvocation))
  }

  private extractAssertData(methodInvocation: MethodOrFunctionInvocation): TestAssert {
    const testAssert: TestAssert = {
      matcher: methodInvocation.identifier
    }

    if (
      [
        "assertArrayEquals",
        "assertEquals",
        "assertNotSame",
        "assertSame",
        "assertThat",
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length === 2) {
        testAssert.literalActual = getLiteralValue(methodInvocation.parameterNodes[1])
        testAssert.literalExpected = getLiteralValue(methodInvocation.parameterNodes[0])
      } else if (methodInvocation.parameterNodes?.length === 3) {
        testAssert.literalActual = getLiteralValue(methodInvocation.parameterNodes[2])
        testAssert.literalExpected = getLiteralValue(methodInvocation.parameterNodes[1])
        testAssert.message = getLiteralValue(methodInvocation.parameterNodes[0])
      }
    } else if (
      [
        "assertFalse",
        "assertNotNull",
        "assertNull",
        "assertTrue",
      ].includes(methodInvocation.identifier)
    ) {
      if (methodInvocation.parameterNodes?.length === 1) {
        testAssert.literalActual = getLiteralValue(methodInvocation.parameterNodes[0])
      } else if (methodInvocation.parameterNodes?.length === 2) {
        testAssert.literalActual = getLiteralValue(methodInvocation.parameterNodes[1])
        testAssert.message = getLiteralValue(methodInvocation.parameterNodes[0])
      }
    }

    return testAssert;
  }
}

export default JavaJUnitASTTestExtractor;
